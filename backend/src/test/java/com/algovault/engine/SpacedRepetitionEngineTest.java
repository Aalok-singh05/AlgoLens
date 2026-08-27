package com.algovault.engine;

import com.algovault.model.RevisionCard;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SpacedRepetitionEngineTest {

    private final SpacedRepetitionEngine engine = new SpacedRepetitionEngine();

    @Test
    void updateCard_firstReview_goodQuality_setsInitialStability() {
        RevisionCard card = RevisionCard.builder()
            .reviewCount(0)
            .intervalDays(0.0)
            .easeFactor(null)
            .build();

        // Quality 3 maps to Good (grade 3), initial stability must equal W[2] (3.1262)
        RevisionCard updated = engine.updateCard(card, 3, 1.0, false);

        assertTrue(updated.getIntervalDays() >= 1.0, "First review should set a positive interval");
        assertNotNull(updated.getStability(), "Stability should be stored in stability field");
        assertEquals(SpacedRepetitionEngine.W[2], updated.getStability(), 0.0001, "First Good review stability must equal W[2] (3.1262)");
        assertEquals(1, updated.getReviewCount());
        assertNotNull(updated.getNextReview());
        assertNotNull(updated.getLastReviewed());
    }

    @Test
    void updateCard_firstReview_allGrades_orderCorrectly() {
        RevisionCard cardAgain = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 1, 1.0, false);
        RevisionCard cardHard  = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 2, 1.0, false);
        RevisionCard cardGood  = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 3, 1.0, false);
        RevisionCard cardEasy  = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 4, 1.0, false);
        RevisionCard cardEasy5 = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 5, 1.0, false);

        // First review stability must strictly follow: Again (0.4072) < Hard (1.1829) < Good (3.1262) < Easy (15.4722)
        assertEquals(0.4072, cardAgain.getStability(), 0.0001);
        assertEquals(1.1829, cardHard.getStability(), 0.0001);
        assertEquals(3.1262, cardGood.getStability(), 0.0001);
        assertEquals(15.4722, cardEasy.getStability(), 0.0001);
        assertEquals(15.4722, cardEasy5.getStability(), 0.0001);

        assertTrue(cardAgain.getIntervalDays() <= cardHard.getIntervalDays());
        assertTrue(cardHard.getIntervalDays() <= cardGood.getIntervalDays());
        assertTrue(cardGood.getIntervalDays() <= cardEasy.getIntervalDays());
    }

    @Test
    void updateCard_gradeMapping_qualityFourAndFive_mapToEasy() {
        RevisionCard cardQuality3 = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 3, 1.0, false);
        RevisionCard cardQuality4 = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 4, 1.0, false);
        RevisionCard cardQuality5 = engine.updateCard(RevisionCard.builder().reviewCount(0).build(), 5, 1.0, false);

        // Quality 3 -> Good (W[2]), Quality 4 & 5 -> Easy (W[3])
        assertEquals(SpacedRepetitionEngine.W[2], cardQuality3.getStability(), 0.0001);
        assertEquals(SpacedRepetitionEngine.W[3], cardQuality4.getStability(), 0.0001);
        assertEquals(SpacedRepetitionEngine.W[3], cardQuality5.getStability(), 0.0001);
    }

    @Test
    void updateCard_sameDayReview_retrievabilityIsOne_noFallbackToPointNine() {
        LocalDateTime now = LocalDateTime.now();
        double initialStability = 10.0;
        double initialDifficulty = 4.0;

        // Card reviewed 0 minutes ago (same-day immediate review)
        RevisionCard card = RevisionCard.builder()
            .reviewCount(1)
            .stability(initialStability)
            .difficulty(initialDifficulty)
            .lastReviewed(now)
            .build();

        // When elapsedDays == 0, retrievability R = 1.0 exactly.
        // In nextRecallStability, (exp(w10 * (1 - 1.0)) - 1) = (exp(0) - 1) = 0.
        // Therefore, new stability S' = S * (1 + 0) = S exactly.
        RevisionCard updated = engine.updateCard(card, 3, 1.0, false); // Quality 3 (Good)

        assertEquals(initialStability, updated.getStability(), 0.0001,
            "Immediate same-day review at R=1.0 should produce stability unchanged without artificial inflation or fallback to 0.9");
    }

    @Test
    void nextForgetStability_exactValue_noCapAtPrevStability() {
        // When previous stability is very small (e.g. 0.2) and difficulty is low (e.g. 1.0),
        // nextForgetStability computes a newS > prevS.
        // FSRS-4.5 specification does not artificially cap forget stability at prevS.
        double prevS = 0.2;
        double difficulty = 1.0;
        double retrievability = 0.9;

        double uncappedS = engine.nextForgetStability(prevS, difficulty, retrievability);

        assertTrue(uncappedS >= 0.1, "Forget stability must respect minimum floor of 0.1");
        // Verify formula calculation: w11 * (difficulty^-w12) * ((prevS + 1)^w13 - 1) * exp(w16 * (1 - R))
        double expected = SpacedRepetitionEngine.W[11]
            * Math.pow(difficulty, -SpacedRepetitionEngine.W[12])
            * (Math.pow(prevS + 1.0, SpacedRepetitionEngine.W[13]) - 1.0)
            * Math.exp(SpacedRepetitionEngine.W[16] * (1.0 - retrievability));
        assertEquals(Math.max(0.1, expected), uncappedS, 0.0001);
    }

    @Test
    void fsrsWeights_integrityAndCount_allNineteenWeightsValid() {
        assertEquals(19, SpacedRepetitionEngine.W.length, "FSRS-4.5 weight array must contain exactly 19 parameters (w0..w18)");

        // Initial stabilities must be strictly positive and strictly ascending
        assertTrue(SpacedRepetitionEngine.W[0] > 0);
        assertTrue(SpacedRepetitionEngine.W[0] < SpacedRepetitionEngine.W[1]);
        assertTrue(SpacedRepetitionEngine.W[1] < SpacedRepetitionEngine.W[2]);
        assertTrue(SpacedRepetitionEngine.W[2] < SpacedRepetitionEngine.W[3]);

        // Hard penalty < 1.0 and Easy bonus > 1.0
        assertTrue(SpacedRepetitionEngine.W[14] < 1.0, "Hard penalty W[14] must be < 1.0");
        assertTrue(SpacedRepetitionEngine.W[15] > 1.0, "Easy bonus W[15] must be > 1.0");

        // Decay exponent and factor must be positive
        assertTrue(SpacedRepetitionEngine.W[17] > 0, "Decay exponent W[17] must be > 0");
        assertTrue(SpacedRepetitionEngine.FACTOR > 0, "Derived FACTOR must be > 0");
    }

    @Test
    void updateCard_failedReview_reducesStability() {
        RevisionCard card = RevisionCard.builder()
            .reviewCount(5)
            .intervalDays(30.0)
            .stability(10.0)
            .difficulty(4.0)
            .lastReviewed(LocalDateTime.now().minusDays(30))
            .build();

        RevisionCard updated = engine.updateCard(card, 0, 1.0, false);

        assertTrue(updated.getStability() < 10.0,
            "Failed review must reduce stability below previous (got " + updated.getStability() + ")");
        assertTrue(updated.getIntervalDays() < 30.0,
            "Failed review must reduce interval, got " + updated.getIntervalDays());
    }

    @Test
    void updateCard_contestFailure_shortensInterval() {
        RevisionCard normal = engine.updateCard(
            RevisionCard.builder().reviewCount(3).intervalDays(10.0).stability(5.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(10)).build(),
            3, 1.0, false);
        RevisionCard contested = engine.updateCard(
            RevisionCard.builder().reviewCount(3).intervalDays(10.0).stability(5.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(10)).build(),
            3, 1.0, true);

        assertTrue(contested.getIntervalDays() <= normal.getIntervalDays(),
            "Contest failure should produce a shorter or equal interval");
    }

    @Test
    void updateCard_weaknessMultiplier_acceleratesReview() {
        RevisionCard normal = engine.updateCard(
            RevisionCard.builder().reviewCount(3).intervalDays(10.0).stability(5.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(10)).build(),
            3, 1.0, false);
        RevisionCard weak = engine.updateCard(
            RevisionCard.builder().reviewCount(3).intervalDays(10.0).stability(5.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(10)).build(),
            3, 0.6, false);

        assertTrue(weak.getIntervalDays() <= normal.getIntervalDays(),
            "Weakness multiplier should produce shorter or equal interval");
    }

    @Test
    void updateCard_difficultyEvolution_hardIncreases_easyDecreases() {
        double baselineD = 5.0;

        RevisionCard hardCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).stability(3.0).difficulty(baselineD).lastReviewed(LocalDateTime.now().minusDays(5)).build(),
            2, 1.0, false
        );

        RevisionCard easyCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).stability(3.0).difficulty(baselineD).lastReviewed(LocalDateTime.now().minusDays(5)).build(),
            4, 1.0, false
        );

        assertTrue(hardCard.getDifficulty() > baselineD,
            "Hard review must increase difficulty (was " + baselineD + ", now " + hardCard.getDifficulty() + ")");
        assertTrue(easyCard.getDifficulty() < baselineD,
            "Easy review must decrease difficulty (was " + baselineD + ", now " + easyCard.getDifficulty() + ")");
    }

    @Test
    void updateCard_subsequentReviews_hardProducesShorterIntervalThanGoodAndEasy() {
        RevisionCard hardCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).intervalDays(5.0).stability(3.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(5)).build(),
            2, // Hard
            1.0, false
        );

        RevisionCard goodCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).intervalDays(5.0).stability(3.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(5)).build(),
            3, // Good
            1.0, false
        );

        RevisionCard easyCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).intervalDays(5.0).stability(3.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(5)).build(),
            4, // Easy
            1.0, false
        );

        assertTrue(hardCard.getStability() < goodCard.getStability(),
            "Hard stability (" + hardCard.getStability() + ") must be less than Good stability (" + goodCard.getStability() + ")");
        assertTrue(goodCard.getStability() < easyCard.getStability(),
            "Good stability (" + goodCard.getStability() + ") must be less than Easy stability (" + easyCard.getStability() + ")");
        assertTrue(hardCard.getIntervalDays() <= goodCard.getIntervalDays(),
            "Hard interval must be <= Good interval");
        assertTrue(goodCard.getIntervalDays() <= easyCard.getIntervalDays(),
            "Good interval must be <= Easy interval");
    }

    @Test
    void updateCard_elapsedDays_longerDelayProducesLargerRecallStabilityJump() {
        // Recalling successfully after a long delay proves strong memory durability -> higher stability jump
        RevisionCard onTimeCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).stability(3.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(3)).build(),
            3, // Good
            1.0, false
        );

        RevisionCard lateCard = engine.updateCard(
            RevisionCard.builder().reviewCount(2).stability(3.0).difficulty(4.0).lastReviewed(LocalDateTime.now().minusDays(30)).build(),
            3, // Good
            1.0, false
        );

        assertTrue(lateCard.getStability() > onTimeCard.getStability(),
            "Successful recall after longer delay must yield higher stability (onTime: " + onTimeCard.getStability() + ", late: " + lateCard.getStability() + ")");
    }

    @Test
    void updateCard_intervalNeverBelowOne() {
        RevisionCard card = RevisionCard.builder()
            .reviewCount(0)
            .intervalDays(0.0)
            .stability(null)
            .build();

        RevisionCard updated = engine.updateCard(card, 0, 0.6, true);

        assertTrue(updated.getIntervalDays() >= 1.0,
            "Interval should never be less than 1 day");
    }
}
