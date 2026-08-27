package com.algovault.service;
import com.algovault.model.Submission;
import com.algovault.model.ProblemOpenEvent;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Comparator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@org.springframework.transaction.annotation.Transactional
public class AnalyticsService {
    private static final double LOGISTIC_LEARNING_RATE = 0.05;
    private static final double LOGISTIC_L2 = 0.05;
    private static final int MAX_LOGISTIC_ITERATIONS = 2_000;
    private static final double LOGISTIC_CONVERGENCE_TOLERANCE = 1e-5;

    private final MasteryService masteryService;
    private final TopicRatingService topicRatingService;
    private final HeatmapService heatmapService;
    private final com.algovault.repository.UserRepository userRepository;
    private final com.algovault.repository.SubmissionRepository submissionRepository;

    @org.springframework.cache.annotation.Caching(evict = {
        @org.springframework.cache.annotation.CacheEvict(value = "dashboard", key = "#userId"),
        @org.springframework.cache.annotation.CacheEvict(value = "heatmap", key = "#userId"),
        @org.springframework.cache.annotation.CacheEvict(value = "mastery", key = "#userId"),
        @org.springframework.cache.annotation.CacheEvict(value = "potd", key = "#userId"),
        @org.springframework.cache.annotation.CacheEvict(value = "contests", key = "#userId"),
        @org.springframework.cache.annotation.CacheEvict(value = "weakness", key = "#userId"),
        @org.springframework.cache.annotation.CacheEvict(value = "predictions", allEntries = true)
    })
    public void recomputeAll(Long userId) {
        log.info("Recomputing analytics for user ID: {}", userId);
        recomputeMastery(userId);
        recomputeTopicRatings(userId);
        recomputeRatingBuckets(userId);
        recomputeVirtualRating(userId);
        log.info("Analytics recomputation completed for user ID: {}", userId);
    }
    
    public void recomputeMastery(Long userId) {
        masteryService.computeMastery(userId);
    }
    
    public void recomputeTopicRatings(Long userId) {
        topicRatingService.recomputeElo(userId);
    }
    
    public void recomputeRatingBuckets(Long userId) {
        heatmapService.recomputeHeatmap(userId);
    }

    public void updateIncremental(Long userId, Submission submission) {
        log.info("Incremental update of analytics for user: {}, submission: {}", userId, submission.getId());
        masteryService.updateIncremental(userId, submission);
        topicRatingService.updateIncremental(userId, submission);
        heatmapService.updateIncremental(userId, submission);
        recomputeVirtualRating(userId);
    }

    public void updateIncremental(Long userId, ProblemOpenEvent event) {
        log.info("Incremental update of analytics for user: {}, event: {}", userId, event.getId());
        masteryService.updateIncremental(userId, event);
    }

    public void recomputeVirtualRating(Long userId) {
        com.algovault.model.User user = userRepository.findById(userId).orElseThrow();
        if (user.getLcRating() != null && user.getLcRating() > 0) {
            user.setVirtualRating(user.getLcRating());
            userRepository.save(user);
            return;
        }

        List<Submission> submissions = submissionRepository.findByUserId(userId);
        if (submissions.isEmpty()) {
            user.setVirtualRating(1500);
            userRepository.save(user);
            return;
        }

        // Group submissions by problem to analyze outcomes per unique problem
        Map<Long, List<Submission>> problemAttempts = new HashMap<>();
        for (Submission s : submissions) {
            if (s.getProblem() != null && s.getProblem().getActualRating() != null) {
                problemAttempts.computeIfAbsent(s.getProblem().getId(), k -> new ArrayList<>()).add(s);
            }
        }

        if (problemAttempts.size() < 10) {
            // Fallback for very small datasets: weighted average of solved problem ratings
            double solvedSum = 0;
            int solvedCount = 0;
            double maxRating = 0;
            for (Map.Entry<Long, List<Submission>> entry : problemAttempts.entrySet()) {
                boolean solved = entry.getValue().stream().anyMatch(s -> "Accepted".equals(s.getVerdict()));
                double rating = entry.getValue().get(0).getProblem().getActualRating();
                if (solved) {
                    solvedSum += rating;
                    solvedCount++;
                    if (rating > maxRating) {
                        maxRating = rating;
                    }
                }
            }
            if (solvedCount == 0) {
                user.setVirtualRating(1200);
            } else {
                double avg = solvedSum / solvedCount;
                // Blended estimate with max solved rating to reflect ceiling
                user.setVirtualRating((int) Math.round(0.8 * avg + 0.2 * maxRating));
            }
            userRepository.save(user);
            return;
        }

        // Prepare dataset for Sigmoid Fitting
        List<double[]> dataset = new ArrayList<>(); // each item: [normalizedRating, outcome]
        double maxSolvedRating = 0;
        double minAttemptedRating = Double.MAX_VALUE;
        int solvedCount = 0;

        for (Map.Entry<Long, List<Submission>> entry : problemAttempts.entrySet()) {
            List<Submission> subs = entry.getValue();
            double rating = subs.get(0).getProblem().getActualRating();
            minAttemptedRating = Math.min(minAttemptedRating, rating);

            // A capability estimate must use the first independent attempt.
            // Treating an eventual AC after hints/editorials as a fractional
            // success biases the estimate upward and double-counts persistence.
            subs.sort(Comparator.comparing(Submission::getSubmittedAt));
            boolean firstAttemptAccepted = "Accepted".equals(subs.get(0).getVerdict());
            double outcome = firstAttemptAccepted ? 1.0 : 0.0;
            if (firstAttemptAccepted) {
                solvedCount++;
                maxSolvedRating = Math.max(maxSolvedRating, rating);
            }

            // Calculate temporal weight based on 365-day half-life of concept retention
            LocalDateTime lastSubmissionTime = subs.stream()
                .map(Submission::getSubmittedAt)
                .max(Comparator.naturalOrder())
                .orElse(LocalDateTime.now());
            long daysAgo = java.time.Duration.between(lastSubmissionTime, LocalDateTime.now()).toDays();
            double weight = 1.0;
            if (daysAgo > 0) {
                weight = Math.exp(- (Math.log(2.0) / 365.0) * daysAgo);
            }
            weight = Math.max(0.10, weight); // minimum baseline weight of 10%

            // Normalize rating: (Rating - 1500) / 500
            double normRating = (rating - 1500.0) / 500.0;
            dataset.add(new double[]{normRating, outcome, weight});
        }

        double totalProblems = dataset.size();
        double solveRate = (double) solvedCount / totalProblems;

        if (solveRate > 0.95) {
            // Extreme boundary: user solved almost everything attempted
            user.setVirtualRating((int) Math.round(maxSolvedRating + 100));
        } else if (solveRate < 0.05) {
            // Extreme boundary: user failed almost everything attempted
            user.setVirtualRating((int) Math.max(800, Math.round(minAttemptedRating - 100)));
        } else {
            // Fit Logistic Regression: P(success) = 1 / (1 + e^-(theta0 - theta1 * x))
            double theta0 = 0.0;
            double theta1 = 1.0; // Positive coefficient (higher rating means lower probability of success)
            boolean converged = false;
            boolean numericallyStable = true;

            for (int iter = 0; iter < MAX_LOGISTIC_ITERATIONS; iter++) {
                double grad0 = 0.0;
                double grad1 = 0.0;
                double sumWeights = 0.0;

                for (double[] point : dataset) {
                    double x = point[0];
                    double y = point[1];
                    double w = point[2];
                    double z = Math.max(-35.0, Math.min(35.0, theta0 - theta1 * x));
                    double p = 1.0 / (1.0 + Math.exp(-z));

                    grad0 += w * (p - y);
                    grad1 += w * (p - y) * (-x);
                    sumWeights += w;
                }

                if (!(sumWeights > 0.0) || !Double.isFinite(sumWeights)) {
                    numericallyStable = false;
                    break;
                }

                double avgGrad0 = grad0 / sumWeights;
                double avgGrad1 = (grad1 / sumWeights) + LOGISTIC_L2 * theta1; // Only regularize the slope
                if (!Double.isFinite(avgGrad0) || !Double.isFinite(avgGrad1)) {
                    numericallyStable = false;
                    break;
                }

                double nextTheta0 = theta0 - LOGISTIC_LEARNING_RATE * avgGrad0;
                double nextTheta1 = theta1 - LOGISTIC_LEARNING_RATE * avgGrad1;

                // Project theta1 to be positive so probability strictly decreases with rating difficulty
                nextTheta1 = Math.max(0.05, nextTheta1);
                if (!Double.isFinite(nextTheta0) || !Double.isFinite(nextTheta1)) {
                    numericallyStable = false;
                    break;
                }

                double parameterStep = Math.max(Math.abs(nextTheta0 - theta0), Math.abs(nextTheta1 - theta1));
                theta0 = nextTheta0;
                theta1 = nextTheta1;
                if (parameterStep < LOGISTIC_CONVERGENCE_TOLERANCE) {
                    converged = true;
                    break;
                }
            }

            if (!numericallyStable || !converged || theta1 <= 0.05 || !Double.isFinite(theta0)) {
                // A non-converged optimizer is evidence of an underdetermined
                // sample, not a license to publish a spurious skill number.
                int fallback = user.getVirtualRating() != null
                    ? user.getVirtualRating()
                    : fallbackVirtualRating(problemAttempts);
                log.warn("Virtual rating logistic fit did not converge for user {}; keeping fallback {}", userId, fallback);
                user.setVirtualRating(fallback);
            } else {
                // Find rating where solve probability is exactly 50%: theta0 - theta1 * x = 0 => x = theta0 / theta1
                double targetNormRating = theta0 / theta1;
                double estimatedRating = targetNormRating * 500.0 + 1500.0;
                estimatedRating = Math.max(800.0, Math.min(3000.0, estimatedRating));

                // This is the estimated 50% first-attempt rating from one
                // regularized model. Do not blend it with a pseudo-Glicko value:
                // both consume the same submissions and their average has no
                // statistical interpretation.
                user.setVirtualRating((int) Math.round(estimatedRating));
            }
        }

        userRepository.save(user);
    }

    private int fallbackVirtualRating(Map<Long, List<Submission>> problemAttempts) {
        double solvedSum = 0.0;
        double maxSolvedRating = 0.0;
        int solvedCount = 0;
        for (List<Submission> attempts : problemAttempts.values()) {
            if (attempts.isEmpty()) continue;
            attempts.sort(Comparator.comparing(Submission::getSubmittedAt));
            Submission first = attempts.get(0);
            if (!"Accepted".equals(first.getVerdict())) continue;
            double rating = first.getProblem().getActualRating();
            solvedSum += rating;
            maxSolvedRating = Math.max(maxSolvedRating, rating);
            solvedCount++;
        }
        if (solvedCount == 0) return 1200;
        double average = solvedSum / solvedCount;
        return (int) Math.round(Math.max(800.0, Math.min(3000.0, 0.8 * average + 0.2 * maxSolvedRating)));
    }
}
