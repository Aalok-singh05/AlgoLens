package com.algovault.engine;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

/**
 * Implements the official Glicko-2 rating system (Glickman, 2001) to track Tag Mastery.
 * Every tag (e.g., "Dynamic Programming") is treated as a player.
 * Every problem attempted is treated as an opponent.
 */
@Component
@Slf4j
public class Glicko2MasteryEngine {

    public static final double TAU = 0.5; // System constant
    public static final double SCALE = 173.7178;
    public static final double VOLATILITY_EPSILON = 0.000001;
    private static final int MAX_VOLATILITY_BRACKET_STEPS = 100;
    private static final int MAX_VOLATILITY_ITERATIONS = 100;

    public static class GlickoRating {
        public double rating;
        public double rd; // Rating Deviation
        public double volatility;

        public GlickoRating(double rating, double rd, double volatility) {
            this.rating = rating;
            this.rd = rd;
            this.volatility = volatility;
        }

        public GlickoRating() {
            this(1500.0, 350.0, 0.06);
        }

        @Override
        public String toString() {
            return String.format(Locale.US, "GlickoRating{rating=%.2f, rd=%.2f, volatility=%.6f}",
                    rating, rd, volatility);
        }
    }

    public static class MatchResult {
        public double opponentRating;
        public double opponentRD;
        public double score; // 1.0 for Win, 0.5 for Draw, 0.0 for Loss

        public MatchResult(double opponentRating, double opponentRD, double score) {
            if (!Double.isFinite(opponentRating)) {
                throw new IllegalArgumentException("opponentRating must be finite, got: " + opponentRating);
            }
            if (!Double.isFinite(opponentRD) || opponentRD <= 0.0) {
                throw new IllegalArgumentException("opponentRD must be finite and > 0, got: " + opponentRD);
            }
            if (!Double.isFinite(score) || score < 0.0 || score > 1.0) {
                throw new IllegalArgumentException("score must be between 0.0 and 1.0, got: " + score);
            }
            this.opponentRating = opponentRating;
            this.opponentRD = opponentRD;
            this.score = score;
        }
    }

    /**
     * Glicko-2 g(phi) reduction function.
     */
    public double g(double phi) {
        return 1.0 / Math.sqrt(1.0 + 3.0 * phi * phi / (Math.PI * Math.PI));
    }

    /**
     * Glicko-2 expected score function E(mu, muJ, phiJ).
     */
    public double E(double mu, double muJ, double phiJ) {
        return 1.0 / (1.0 + Math.exp(-g(phiJ) * (mu - muJ)));
    }

    /**
     * Computes the estimated variance v based on game outcomes in the rating period.
     */
    public double computeVariance(double mu, List<MatchResult> matches) {
        double vInv = 0.0;
        for (MatchResult m : matches) {
            double muJ = (m.opponentRating - 1500.0) / SCALE;
            double phiJ = m.opponentRD / SCALE;
            double gj = g(phiJ);
            double ej = E(mu, muJ, phiJ);
            vInv += gj * gj * ej * (1.0 - ej);
        }
        if (!(vInv > 0.0) || !Double.isFinite(vInv)) {
            return Double.POSITIVE_INFINITY;
        }
        return 1.0 / vInv;
    }

    /**
     * Computes estimated improvement delta based on variance and match outcomes.
     */
    public double computeDelta(double mu, double variance, List<MatchResult> matches) {
        double deltaSum = 0.0;
        for (MatchResult m : matches) {
            double muJ = (m.opponentRating - 1500.0) / SCALE;
            double phiJ = m.opponentRD / SCALE;
            double gj = g(phiJ);
            double ej = E(mu, muJ, phiJ);
            deltaSum += gj * (m.score - ej);
        }
        return variance * deltaSum;
    }

    /**
     * Updates rating, RD, and volatility across a rating period (batch of matches).
     * If matches is null or empty, applies time decay to RD only.
     */
    public GlickoRating updateRating(GlickoRating current, List<MatchResult> matches) {
        if (matches == null || matches.isEmpty()) {
            // Apply time decay (only RD increases)
            double phi = current.rd / SCALE;
            double phiPrime = Math.sqrt(phi * phi + current.volatility * current.volatility);
            double newRd = Math.min(phiPrime * SCALE, 350.0);
            return new GlickoRating(current.rating, newRd, current.volatility);
        }

        // Step 2: Convert to Glicko-2 scale
        double mu = (current.rating - 1500.0) / SCALE;
        double phi = current.rd / SCALE;
        double sigma = current.volatility;

        // Step 3 & 4: Compute variance v and estimated improvement delta
        double v = computeVariance(mu, matches);
        if (!Double.isFinite(v) || v <= 0.0) {
            log.debug("Degenerate variance v computed for rating {}, applying time decay", current);
            return decayRating(current);
        }

        double delta = computeDelta(mu, v, matches);

        // Step 5: Update volatility (sigma) using Illinois algorithm
        double a = Math.log(sigma * sigma);
        double A = a;
        double B;
        boolean hasBracket = true;

        if (delta * delta > phi * phi + v) {
            B = Math.log(delta * delta - phi * phi - v);
        } else {
            int k = 1;
            double bracketValue = f(a - k * TAU, delta, phi, v, a);
            while (Double.isFinite(bracketValue) && bracketValue < 0 && k < MAX_VOLATILITY_BRACKET_STEPS) {
                k++;
                bracketValue = f(a - k * TAU, delta, phi, v, a);
            }
            B = a - k * TAU;
            hasBracket = Double.isFinite(bracketValue) && bracketValue >= 0;
        }

        double newSigma = sigma;
        if (hasBracket && Double.isFinite(B)) {
            double fAVal = f(A, delta, phi, v, a);
            double fBVal = f(B, delta, phi, v, a);
            int iteration = 0;
            while (Double.isFinite(fAVal) && Double.isFinite(fBVal)
                    && Math.abs(B - A) > VOLATILITY_EPSILON
                    && iteration++ < MAX_VOLATILITY_ITERATIONS) {
                double denominator = fBVal - fAVal;
                if (Math.abs(denominator) < 1e-12 || !Double.isFinite(denominator)) break;

                double C = A + (A - B) * fAVal / denominator;
                double fCVal = f(C, delta, phi, v, a);
                if (!Double.isFinite(C) || !Double.isFinite(fCVal)) break;

                if (fCVal * fBVal <= 0) {
                    A = B;
                    fAVal = fBVal;
                } else {
                    fAVal = fAVal / 2.0;
                }

                B = C;
                fBVal = fCVal;
            }

            if (Math.abs(B - A) <= VOLATILITY_EPSILON) {
                double candidate = Math.exp(A / 2.0);
                if (Double.isFinite(candidate) && candidate > 0.0) newSigma = candidate;
            } else if (Double.isFinite(A) && A > -50.0) {
                // Safe fallback: use lower bracket A rather than silently retaining old sigma
                double candidate = Math.exp(A / 2.0);
                if (Double.isFinite(candidate) && candidate > 0.0) {
                    log.debug("Using bracket A fallback for volatility: {}", candidate);
                    newSigma = candidate;
                }
            }
        }

        // Step 6: Update RD to pre-rating period value
        double phiStar = Math.sqrt(phi * phi + newSigma * newSigma);

        // Step 7: Update rating and RD
        double phiPrimeInv = 1.0 / (phiStar * phiStar) + 1.0 / v;
        double newPhi = 1.0 / Math.sqrt(phiPrimeInv);

        double newMuSum = 0.0;
        for (MatchResult m : matches) {
            double muJ = (m.opponentRating - 1500.0) / SCALE;
            double phiJ = m.opponentRD / SCALE;
            double gj = g(phiJ);
            double ej = E(mu, muJ, phiJ);
            newMuSum += gj * (m.score - ej);
        }
        double newMu = mu + newPhi * newPhi * newMuSum;

        // Step 8: Convert back to original scale
        double newRating = 1500.0 + newMu * SCALE;
        double newRd = newPhi * SCALE;

        return new GlickoRating(newRating, newRd, newSigma);
    }

    private GlickoRating decayRating(GlickoRating current) {
        double phi = current.rd / SCALE;
        double phiPrime = Math.sqrt(phi * phi + current.volatility * current.volatility);
        return new GlickoRating(current.rating, Math.min(phiPrime * SCALE, 350.0), current.volatility);
    }

    private double f(double x, double delta, double phi, double v, double a) {
        double ex = Math.exp(x);
        double num = ex * (delta * delta - phi * phi - v - ex);
        double den = 2.0 * Math.pow(phi * phi + v + ex, 2.0);
        return (num / den) - ((x - a) / (TAU * TAU));
    }
}
