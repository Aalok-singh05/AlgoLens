package com.algovault.engine;

import com.algovault.model.RevisionCard;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * FSRS-4.5 (Free Spaced Repetition Scheduler) engine.
 *
 * <p>Implements the FSRS-4.5 spaced repetition model published by Jarrett Ye (2023),
 * which powers modern Anki (v23+). Key mathematical properties:</p>
 * <ul>
 *   <li><b>Power-law forgetting curve</b>:
 *       \(R(t, S) = (1 + \text{FACTOR} \cdot (t / S))^{\text{DECAY}}\) where \(S\) is stability,
 *       \(t\) is elapsed days, and \(\text{FACTOR}\) ensures \(R(S, S) = \text{DESIRED\_RETENTION}\) (0.90).</li>
 *   <li><b>Dynamic difficulty with mean reversion</b>:
 *       \(D' = w_7 \cdot D_0(3) + (1 - w_7) \cdot (D - w_6 \cdot (G - 3))\), clamped to \([1, 10]\).</li>
 *   <li><b>Stability updates</b>:
 *       Separate formulations for successful recall (\(S'_r\)) and forgetting (\(S'_f\))
 *       accounting for retrieval difficulty and elapsed retention.</li>
 * </ul>
 */
@Component
public class SpacedRepetitionEngine {

    /**
     * FSRS-4.5 default universal weights (w0..w18) calibrated on millions of review logs.
     */
    public static final double[] W = {
        0.4072,  // w0:  initial stability for Again (G = 1)
        1.1829,  // w1:  initial stability for Hard  (G = 2)
        3.1262,  // w2:  initial stability for Good  (G = 3)
        15.4722, // w3:  initial stability for Easy  (G = 4)
        7.2102,  // w4:  initial difficulty base D₀(1)
        0.5316,  // w5:  initial difficulty grade scaling factor
        1.0651,  // w6:  difficulty linear change factor (ΔD per grade step)
        0.0046,  // w7:  difficulty mean reversion strength toward D₀(3)
        1.5418,  // w8:  recall stability base factor
        0.1576,  // w9:  recall stability sensitivity to previous stability (S^(-w9))
        1.0100,  // w10: recall stability retrievability factor (e^(w10*(1-R)) - 1)
        2.0467,  // w11: forget stability base factor
        0.0086,  // w12: forget stability difficulty power factor (D^(-w12))
        0.3481,  // w13: forget stability previous stability power factor ((S+1)^w13 - 1)
        0.2231,  // w14: recall stability Hard penalty modifier (G = 2, < 1.0)
        1.3559,  // w15: recall stability Easy bonus modifier (G = 4, > 1.0)
        0.0280,  // w16: forget stability retrievability factor (e^(w16*(1-R)))
        2.9282,  // w17: DECAY exponent for power-law forgetting curve (DECAY = -w17)
        0.4403   // w18: reserved / short-term stability factor in standard FSRS-4.5
    };

    /** Target retention rate — 90% is the researched optimal for long-term learning. */
    public static final double DESIRED_RETENTION = 0.9;

    /** FSRS DECAY constant: -w17. */
    public static final double DECAY = -W[17];

    /**
     * FSRS FACTOR constant derived so that R(S, S) = DESIRED_RETENTION (0.90) exactly:
     * R(t, S) = (1 + FACTOR * (t / S))^(-w17)
     * Solving for R(S, S) = DESIRED_RETENTION:
     * (1 + FACTOR)^(-w17) = DESIRED_RETENTION  =>  FACTOR = DESIRED_RETENTION^(-1.0 / w17) - 1.0
     */
    public static final double FACTOR = Math.pow(DESIRED_RETENTION, -1.0 / W[17]) - 1.0;

    /**
     * Updates a revision card after a review.
     *
     * @param card               the card being reviewed
     * @param quality            user's self-assessed quality (0-5 scale, mapped to FSRS grades)
     * @param weaknessMultiplier topic weakness modifier (0.6-1.0; lower = review sooner)
     * @param wasContestFailure  whether this problem was failed in a real contest (halves interval)
     * @return the updated card
     */
    public RevisionCard updateCard(RevisionCard card, int quality, double weaknessMultiplier, boolean wasContestFailure) {
        quality = Math.max(0, Math.min(5, quality));

        // Map 0-5 quality scale to FSRS grades (1..4):
        // 0 or 1 -> Again (1): completely failed or needed full solution
        // 2      -> Hard  (2): solved with significant struggle or heavy hints
        // 3      -> Good  (3): solved with normal effort / minor syntax lookups
        // 4 or 5 -> Easy  (4): solved effortlessly / optimal one-shot clean solve
        int grade;
        if (quality <= 1) {
            grade = 1; // Again
        } else if (quality == 2) {
            grade = 2; // Hard
        } else if (quality == 3) {
            grade = 3; // Good
        } else {
            grade = 4; // Easy (quality 4 or 5)
        }

        int reviewCount = card.getReviewCount() != null ? card.getReviewCount() : 0;
        LocalDateTime now = LocalDateTime.now();

        double stability;
        double difficulty;

        if (reviewCount == 0 || card.getStability() == null) {
            // ─── First review: initialize stability and difficulty from weights ───
            stability = W[grade - 1]; // w0..w3 for Again/Hard/Good/Easy
            difficulty = initDifficulty(grade);
        } else {
            // ─── Subsequent reviews: use real elapsed time and dynamic R ───
            double prevStability = card.getStability() != null ? card.getStability() : W[2];
            double prevDifficulty = card.getDifficulty() != null ? card.getDifficulty() : initDifficulty(3);

            // 1. Calculate actual elapsed time in fractional days since previous review
            double elapsedDays = 0.0;
            if (card.getLastReviewed() != null) {
                long minutes = Math.max(0, java.time.Duration.between(card.getLastReviewed(), now).toMinutes());
                elapsedDays = minutes / 1440.0;
            }

            // 2. Dynamic retrievability via power-law forgetting curve: R(t, S)
            // For t >= 0 and S > 0, R(0, S) = (1 + 0)^DECAY = 1.0 (exact same-day retrievability)
            double retrievability;
            if (prevStability > 0) {
                retrievability = Math.pow(1.0 + FACTOR * (Math.max(0.0, elapsedDays) / prevStability), DECAY);
            } else {
                retrievability = 1.0;
            }
            retrievability = Math.max(0.01, Math.min(1.0, retrievability));

            // 3. Update difficulty with mean reversion toward D₀(3)
            difficulty = nextDifficulty(prevDifficulty, grade);

            // 4. Update stability based on recall vs forgetting
            if (grade == 1) {
                stability = nextForgetStability(prevStability, difficulty, retrievability);
            } else {
                stability = nextRecallStability(prevStability, difficulty, grade, retrievability);
            }
        }

        // Base interval for 90% retention is the stability itself (in days)
        double interval = stability;

        // Apply weakness acceleration (topic-aware scheduling)
        weaknessMultiplier = Math.max(0.6, Math.min(1.0, weaknessMultiplier));
        interval = interval * weaknessMultiplier;

        // Contest failure penalty: review sooner
        if (wasContestFailure) {
            interval = interval * 0.5;
        }

        // Clamp interval to at least 1 day
        int days = Math.max(1, (int) Math.round(interval));

        // ─── Persist state ───────────────────────────────────────────────
        card.setStability(stability);
        card.setDifficulty(difficulty);
        card.setEaseFactor(stability); // Synchronized for backward compatibility
        card.setIntervalDays((double) days);
        card.setLastReviewed(now);
        card.setNextReview(now.plusDays(days));
        card.setReviewCount(reviewCount + 1);
        card.setConfidence(grade == 1 ? 1 : grade + 1);

        return card;
    }

    // ─── FSRS Internal Functions ─────────────────────────────────────────

    /**
     * Initial difficulty for a card based on first review grade.
     * \(D_0(G) = w_4 - e^{w_5 \cdot (G - 1)} + 1\)
     */
    public double initDifficulty(int grade) {
        double d = W[4] - Math.exp(W[5] * (grade - 1)) + 1.0;
        return clampDifficulty(d);
    }

    /**
     * Next difficulty after a review.
     * Applies mean reversion toward \(D_0(3)\) to prevent difficulty from drifting to extremes.
     * \(D' = D - w_6 \cdot (G - 3)\)
     * \(D_{next} = w_7 \cdot D_0(3) + (1 - w_7) \cdot D'\)
     */
    public double nextDifficulty(double prevD, int grade) {
        double d0Good = initDifficulty(3);
        double delta = -W[6] * (grade - 3);
        double nextD = prevD + delta;
        nextD = W[7] * d0Good + (1.0 - W[7]) * nextD;
        return clampDifficulty(nextD);
    }

    /**
     * Stability after successful recall with dynamic retrievability R.
     * \(S'_r = S \cdot (1 + e^{w_8} \cdot (11 - D) \cdot S^{-w_9} \cdot (e^{w_{10} \cdot (1 - R)} - 1) \cdot \text{hardPenalty} \cdot \text{easyBonus})\)
     */
    public double nextRecallStability(double prevS, double difficulty, int grade, double retrievability) {
        double hardPenalty = (grade == 2) ? W[14] : 1.0; // W[14] = hard penalty (0.2231)
        double easyBonus = (grade == 4) ? W[15] : 1.0;   // W[15] = easy bonus (1.3559)

        double newS = prevS * (1.0 + Math.exp(W[8])
                * (11.0 - difficulty)
                * Math.pow(prevS, -W[9])
                * (Math.exp(W[10] * (1.0 - retrievability)) - 1.0)
                * hardPenalty
                * easyBonus);

        return Math.max(0.1, newS);
    }

    /**
     * Stability after forgetting (grade = Again) with dynamic retrievability R.
     * \(S'_f = w_{11} \cdot D^{-w_{12}} \cdot ((S + 1)^{w_{13}} - 1) \cdot e^{w_{16} \cdot (1 - R)}\)
     */
    public double nextForgetStability(double prevS, double difficulty, double retrievability) {
        double newS = W[11]
                * Math.pow(difficulty, -W[12])
                * (Math.pow(prevS + 1.0, W[13]) - 1.0)
                * Math.exp(W[16] * (1.0 - retrievability));

        return Math.max(0.1, newS);
    }

    public double clampDifficulty(double d) {
        return Math.max(1.0, Math.min(10.0, d));
    }
}
