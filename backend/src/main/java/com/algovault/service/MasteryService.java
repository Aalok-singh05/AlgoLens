package com.algovault.service;
import com.algovault.model.Submission;
import com.algovault.model.TagMastery;
import com.algovault.model.User;
import com.algovault.model.ProblemOpenEvent;
import com.algovault.repository.SubmissionRepository;
import com.algovault.repository.TagMasteryRepository;
import com.algovault.repository.UserRepository;
import com.algovault.engine.Glicko2MasteryEngine;
import com.algovault.repository.ProblemOpenEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

@Service
@org.springframework.transaction.annotation.Transactional
@RequiredArgsConstructor
@Slf4j
public class MasteryService {
    private final SubmissionRepository submissionRepository;
    private final TagMasteryRepository tagMasteryRepository;
    private final UserRepository userRepository;
    private final ProblemOpenEventRepository problemOpenEventRepository;
    private final Glicko2MasteryEngine glickoEngine;

    @Transactional(readOnly = true)
    @Cacheable(value = "mastery", key = "#userId")
    public List<TagMastery> getMastery(Long userId) {
        return tagMasteryRepository.findByUserIdOrderByMasteryScoreDesc(userId);
    }

    @CacheEvict(value = "mastery", key = "#userId")
    @Transactional
    public List<TagMastery> recomputeAndGetMastery(Long userId) {
        computeMastery(userId);
        return tagMasteryRepository.findByUserIdOrderByMasteryScoreDesc(userId);
    }

    @CacheEvict(value = "mastery", key = "#userId")
    @Transactional
    public void computeMastery(Long userId) {
        log.info("Computing Tag Mastery for user {}", userId);
        User user = userRepository.findById(userId).orElseThrow();
        List<Submission> allSubmissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);

        Map<Long, ProblemOpenEvent> latestEventMap = buildLatestEventMap(userId);

        Map<String, Map<Long, List<Submission>>> tagToProblemAttempts = new HashMap<>();
        for (Submission sub : allSubmissions) {
            if (sub.getProblem() != null && sub.getProblem().getTags() != null) {
                for (String tag : sub.getProblem().getTags()) {
                    tagToProblemAttempts
                        .computeIfAbsent(tag, k -> new HashMap<>())
                        .computeIfAbsent(sub.getProblem().getId(), k -> new ArrayList<>())
                        .add(sub);
                }
            }
        }

        List<TagMastery> updatedMasteries = new ArrayList<>();

        for (Map.Entry<String, Map<Long, List<Submission>>> entry : tagToProblemAttempts.entrySet()) {
            String tag = entry.getKey();
            List<List<Submission>> attempts = new ArrayList<>(entry.getValue().values());
            attempts.forEach(list -> list.sort(Comparator.comparing(Submission::getSubmittedAt)));
            attempts.sort(Comparator.comparing(list -> list.get(0).getSubmittedAt()));

            TagRatingResult result = computeTagRating(user, attempts, latestEventMap);

            TagMastery tm = tagMasteryRepository.findByUserIdAndTag(userId, tag)
                .orElse(TagMastery.builder().user(user).tag(tag).build());

            applyRatingResult(tm, result);
            updatedMasteries.add(tm);
        }

        Set<String> computedTags = updatedMasteries.stream().map(TagMastery::getTag).collect(java.util.stream.Collectors.toSet());
        List<TagMastery> stale = tagMasteryRepository.findByUserIdOrderByMasteryScoreDesc(userId).stream()
            .filter(mastery -> !computedTags.contains(mastery.getTag()))
            .toList();
        tagMasteryRepository.deleteAll(stale);
        tagMasteryRepository.saveAll(updatedMasteries);
    }

    @CacheEvict(value = "mastery", key = "#userId")
    @Transactional
    public void updateIncremental(Long userId, Submission submission) {
        if (submission.getProblem() == null || submission.getProblem().getTags() == null) return;
        List<String> tags = submission.getProblem().getTags();
        if (tags.isEmpty()) return;
        User user = userRepository.findById(userId).orElseThrow();
        for (String tag : tags) {
            recomputeMasteryForTag(user, tag);
        }
    }

    @CacheEvict(value = "mastery", key = "#userId")
    @Transactional
    public void updateIncremental(Long userId, ProblemOpenEvent event) {
        if (event.getProblem() == null || event.getProblem().getTags() == null) return;
        List<String> tags = event.getProblem().getTags();
        if (tags.isEmpty()) return;
        User user = userRepository.findById(userId).orElseThrow();
        for (String tag : tags) {
            recomputeMasteryForTag(user, tag);
        }
    }

    @Transactional
    public void recomputeMasteryForTag(User user, String tag) {
        List<Submission> tagSubs = submissionRepository.findByUserIdAndTag(user.getId(), tag);

        if (tagSubs.isEmpty()) {
            tagMasteryRepository.findByUserIdAndTag(user.getId(), tag).ifPresent(tagMasteryRepository::delete);
            return;
        }

        Map<Long, ProblemOpenEvent> latestEventMap = buildLatestEventMap(user.getId());

        Map<Long, List<Submission>> problemAttemptsMap = new HashMap<>();
        for (Submission sub : tagSubs) {
            problemAttemptsMap.computeIfAbsent(sub.getProblem().getId(), k -> new ArrayList<>()).add(sub);
        }

        List<List<Submission>> attempts = new ArrayList<>(problemAttemptsMap.values());
        attempts.forEach(list -> list.sort(Comparator.comparing(Submission::getSubmittedAt)));
        attempts.sort(Comparator.comparing(list -> list.get(0).getSubmittedAt()));

        TagRatingResult result = computeTagRating(user, attempts, latestEventMap);

        TagMastery tm = tagMasteryRepository.findByUserIdAndTag(user.getId(), tag)
            .orElse(TagMastery.builder().user(user).tag(tag).build());

        applyRatingResult(tm, result);
        tagMasteryRepository.save(tm);
    }

    /* ═══════════════════════════════════════════════════════════════
       SHARED CORE: Computes Glicko-2 rating for a single tag
       from its sorted list of problem attempts.
       ═══════════════════════════════════════════════════════════════ */

    /**
     * Internal result container for the shared rating computation.
     */
    private record TagRatingResult(
        Glicko2MasteryEngine.GlickoRating finalRating,
        int totalAttempted,
        int totalSolved,
        int firstAcCount,
        double totalSolveMinutes,
        int timedSolves,
        LocalDateTime lastSolvedAt
    ) {}

    /**
     * Core Glicko-2 rating computation for a single tag.
     * Uses proper monthly batching: all problems solved in the same calendar
     * month are processed as a single Glicko-2 rating period (the standard
     * recommends 10-15 games per period). Gap months between activity trigger
     * empty rating periods to naturally increase RD (uncertainty).
     *
     * Score gradients (fairer than before):
     *   1st-attempt AC, no help:        1.0  (full win)
     *   Multi-attempt AC, no help:      0.65 (good, but cost retries)
     *   Solved with hint:               0.5  (partial credit)
     *   Solved with editorial/external: 0.25 (learned, but not independent)
     *   Not solved:                     0.0  (loss)
     */
    private TagRatingResult computeTagRating(
            User user,
            List<List<Submission>> sortedAttempts,
            Map<Long, ProblemOpenEvent> latestEventMap) {

        int firstAcCount = 0;
        int totalSolved = 0;
        LocalDateTime lastSolvedAt = null;
        double totalSolveMinutes = 0;
        int timedSolves = 0;

        Glicko2MasteryEngine.GlickoRating currentRating =
            new Glicko2MasteryEngine.GlickoRating(1500.0, 350.0, 0.06);

        // ── Step 1: Build per-problem MatchResults and track stats ──
        // Each entry: the YearMonth of the first submission + the MatchResult
        TreeMap<YearMonth, List<Glicko2MasteryEngine.MatchResult>> monthBatches = new TreeMap<>();

        for (List<Submission> problemAttempts : sortedAttempts) {
            Submission first = problemAttempts.get(0);
            Submission accepted = problemAttempts.stream()
                .filter(sub -> "Accepted".equals(sub.getVerdict()))
                .findFirst()
                .orElse(null);

            double score = 0.0;
            if (accepted != null) {
                totalSolved++;
                if ("Accepted".equals(first.getVerdict())) {
                    firstAcCount++;
                }
                if (lastSolvedAt == null || accepted.getSubmittedAt().isAfter(lastSolvedAt)) {
                    lastSolvedAt = accepted.getSubmittedAt();
                }

                // Fairer score gradients
                score = "Accepted".equals(first.getVerdict()) ? 1.0 : 0.65;
                ProblemOpenEvent event = latestEventMap.get(first.getProblem().getId());
                if (event != null) {
                    String help = event.getSelfReportedHelp();
                    if ("EDITORIAL".equals(help) || "EXTERNAL".equals(help)) {
                        score = 0.25; // Was 0.0 — too harsh, user still solved it
                    } else if ("HINT".equals(help)) {
                        score = Math.min(score, 0.5);
                    }
                    if (event.getFocusSeconds() != null && event.getFocusSeconds() > 0) {
                        totalSolveMinutes += event.getFocusSeconds() / 60.0;
                        timedSolves++;
                    }
                } else if (problemAttempts.size() > 1) {
                    long minutes = java.time.Duration.between(
                        first.getSubmittedAt(), accepted.getSubmittedAt()).toMinutes();
                    totalSolveMinutes += Math.max(0, minutes);
                    timedSolves++;
                }
            }

            double opponentRating = first.getProblem().getActualRating() != null
                ? first.getProblem().getActualRating()
                : inferRatingFromDifficulty(first.getProblem().getDifficulty());

            double opponentRD = computeOpponentRD(first.getProblem());

            // Group by month of first submission
            YearMonth month = YearMonth.from(first.getSubmittedAt());
            monthBatches
                .computeIfAbsent(month, k -> new ArrayList<>())
                .add(new Glicko2MasteryEngine.MatchResult(opponentRating, opponentRD, score));
        }

        // ── Step 2: Process batches month-by-month with gap decay ──
        YearMonth prevMonth = null;
        for (Map.Entry<YearMonth, List<Glicko2MasteryEngine.MatchResult>> batch : monthBatches.entrySet()) {
            YearMonth currentMonth = batch.getKey();

            // Apply empty rating periods for gap months between activity
            if (prevMonth != null) {
                long gapMonths = prevMonth.until(currentMonth, java.time.temporal.ChronoUnit.MONTHS) - 1;
                for (long g = 0; g < Math.min(gapMonths, 6); g++) {
                    currentRating = glickoEngine.updateRating(currentRating, Collections.emptyList());
                }
            }

            // Process entire month as one Glicko-2 rating period
            currentRating = glickoEngine.updateRating(currentRating, batch.getValue());
            prevMonth = currentMonth;
        }

        // ── Step 3: Apply trailing time decay for inactivity ──
        if (lastSolvedAt != null) {
            long monthsSince = Math.min(6,
                java.time.Duration.between(lastSolvedAt, LocalDateTime.now()).toDays() / 30);
            for (long m = 0; m < monthsSince; m++) {
                currentRating = glickoEngine.updateRating(currentRating, Collections.emptyList());
            }
        }

        return new TagRatingResult(
            currentRating,
            sortedAttempts.size(),
            totalSolved,
            firstAcCount,
            totalSolveMinutes,
            timedSolves,
            lastSolvedAt
        );
    }

    /**
     * Applies a TagRatingResult to a TagMastery entity.
     * Incorporates sample-size volume damping and RD confidence margins
     * to prevent small sample sizes (e.g. 2-3 solves) from falsely triggering
     * Grandmaster/Master tier ratings before true calibration.
     */
    private void applyRatingResult(TagMastery tm, TagRatingResult r) {
        double rawRating = r.finalRating().rating;
        double rd = r.finalRating().rd;
        double volatility = r.finalRating().volatility;
        int totalSolved = r.totalSolved();
        int totalAttempted = r.totalAttempted();

        double successRate = totalAttempted > 0
            ? (double) totalSolved / totalAttempted : 0.0;

        // Sample-size volume damping: requires at least 5 solves to reach 100% rating scaling
        double volumeDamping = Math.min(1.0, Math.max(0.15, (double) totalSolved / 5.0));

        // Damped rating step from initial 1500 baseline
        double dampedRating = 1500.0 + (rawRating - 1500.0) * volumeDamping;

        // Uncertainty margin subtracts uncalibrated volatility when RD is high (e.g. 350)
        double uncertaintyMargin = (rd / 350.0) * 200.0 * (1.0 - volumeDamping);
        double effectiveMastery = Math.max(800.0, dampedRating - uncertaintyMargin);

        tm.setTotalAttempted(totalAttempted);
        tm.setTotalSolved(totalSolved);
        tm.setFirstAcCount(r.firstAcCount());
        tm.setSuccessRate(successRate * 100.0);
        tm.setAvgSolveTime(r.timedSolves() > 0 ? r.totalSolveMinutes() / r.timedSolves() : null);
        tm.setRawRating(rawRating);
        tm.setMasteryScore(Math.max(800.0, Math.round(effectiveMastery * 10.0) / 10.0));
        tm.setRd(rd);
        tm.setVolatility(volatility);
        tm.setLastSolvedAt(r.lastSolvedAt());
    }

    /**
     * Builds a map of problem ID → latest ProblemOpenEvent for a user.
     */
    private Map<Long, ProblemOpenEvent> buildLatestEventMap(Long userId) {
        Map<Long, ProblemOpenEvent> latestEventMap = new HashMap<>();
        for (ProblemOpenEvent e : problemOpenEventRepository.findByUserId(userId)) {
            Long pid = e.getProblem().getId();
            if (!latestEventMap.containsKey(pid)
                    || latestEventMap.get(pid).getOpenedAt().isBefore(e.getOpenedAt())) {
                latestEventMap.put(pid, e);
            }
        }
        return latestEventMap;
    }

    /**
     * Infers an approximate Elo rating from the difficulty label when no
     * ZeroTrac/contest rating exists. Centers are based on observed
     * LeetCode rating distributions per difficulty bucket.
     */
    private double inferRatingFromDifficulty(String difficulty) {
        if (difficulty == null) return 1500.0;
        return switch (difficulty.toLowerCase()) {
            case "easy" -> 1200.0;   // Range ~800-1400, center at 1200
            case "medium" -> 1500.0; // Range ~1200-1800, center at 1500
            case "hard" -> 2100.0;   // Range ~1800-2800, center at 2100
            default -> 1500.0;
        };
    }

    /**
     * Computes the Glicko-2 opponent rating deviation based on how well-established
     * a problem's rating is. Well-known problems (with acceptance rate data) have
     * low RD; uncertain problems have high RD.
     */
    private double computeOpponentRD(com.algovault.model.Problem problem) {
        if (problem.getActualRating() != null && problem.getAcceptanceRate() != null) {
            // Well-established rating from zerotrac/LC contest data
            return 30.0;
        } else if (problem.getActualRating() != null) {
            // Has a rating but no acceptance data — somewhat confident
            return 60.0;
        } else {
            // Rating inferred from difficulty string — high uncertainty
            return 180.0;
        }
    }
}

