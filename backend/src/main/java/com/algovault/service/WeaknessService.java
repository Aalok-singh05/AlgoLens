package com.algovault.service;

import com.algovault.dto.WeaknessResponse;
import com.algovault.model.TagMastery;
import com.algovault.model.Problem;
import com.algovault.model.User;
import com.algovault.repository.ProblemRepository;
import com.algovault.repository.TagMasteryRepository;
import com.algovault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;

@Service
@org.springframework.transaction.annotation.Transactional
@RequiredArgsConstructor
public class WeaknessService {
    /** Allow any weak tag with at least 1 attempt to generate recommendations */
    private static final int MIN_RECOMMENDATION_EVIDENCE = 1;

    private final TagMasteryRepository tagMasteryRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    @Cacheable(value = "weakness", key = "#userId")
    public WeaknessResponse getWeakness(Long userId) {
        List<TagMastery> masteries = tagMasteryRepository.findByUserIdOrderByMasteryScoreDesc(userId);
        
        // Show early observations transparently, but use the evidence level to
        // distinguish "explore this" from a defensible weakness signal.
        List<WeaknessResponse.WeakTag> weakTags = masteries.stream()
            .filter(m -> m.getTotalAttempted() != null && m.getTotalAttempted() >= 1)
            .sorted((m1, m2) -> {
                // Rank by masteryScore ascending, then by totalAttempted ascending as tie-breaker
                int scoreCompare = Double.compare(m1.getMasteryScore(), m2.getMasteryScore());
                if (scoreCompare != 0) return scoreCompare;
                return Integer.compare(m1.getTotalAttempted(), m2.getTotalAttempted());
            })
            .limit(8)
            .map(m -> {
                String evidenceLevel;
                if (m.getTotalAttempted() >= 10) {
                    evidenceLevel = "STRONG";
                } else if (m.getTotalAttempted() >= 5) {
                    evidenceLevel = "MODERATE";
                } else if (m.getTotalAttempted() >= 3) {
                    evidenceLevel = "PRELIMINARY";
                } else {
                    evidenceLevel = "EARLY";
                }
                return WeaknessResponse.WeakTag.builder()
                    .tag(m.getTag())
                    .masteryScore(m.getMasteryScore())
                    .rd(m.getRd())
                    .evidenceLevel(evidenceLevel)
                    .totalAttempted(m.getTotalAttempted())
                    .build();
            })
            .collect(Collectors.toList());

        User user = userRepository.findById(userId).orElseThrow();
        int baselineRating = user.getVirtualRating() != null
            ? user.getVirtualRating()
            : user.getLcRating() != null ? user.getLcRating() : 1500;
        double targetRating = baselineRating + 50; // slightly above current level is optimal practice
        double minRating = Math.max(800, baselineRating - 200);
        double maxRating = baselineRating + 400;

        List<WeaknessResponse.RecommendedProblem> recommendations = new ArrayList<>();
        java.util.Set<String> recommendedSlugs = new java.util.HashSet<>();
        for (WeaknessResponse.WeakTag weakTag : weakTags) {
            if (weakTag.getTotalAttempted() == null || weakTag.getTotalAttempted() < MIN_RECOMMENDATION_EVIDENCE) {
                continue;
            }
            // Fetch 40 problems sorted by rating proximity for better variety.
            // The SQL query uses COALESCE to include unrated problems via difficulty estimates.
            List<Problem> problems = problemRepository.findRecommendedUnsolved(userId, weakTag.getTag(), minRating, maxRating, targetRating, 40);
            
            // Fallback: if no problems found in the primary range, widen dramatically
            if (problems.isEmpty()) {
                problems = problemRepository.findRecommendedUnsolved(userId, weakTag.getTag(), 800.0, 3000.0, targetRating, 40);
            }
            
            int addedForTag = 0;
            for (Problem p : problems) {
                if (addedForTag >= 8) break;
                if (p != null && !recommendedSlugs.contains(p.getTitleSlug())) {
                    recommendedSlugs.add(p.getTitleSlug());
                    recommendations.add(WeaknessResponse.RecommendedProblem.builder()
                        .title(p.getTitle())
                        .titleSlug(p.getTitleSlug())
                        .tag(weakTag.getTag())
                        .difficulty(p.getDifficulty())
                        .actualRating(p.getActualRating())
                        .frontendId(p.getFrontendId())
                        .acceptanceRate(p.getAcceptanceRate())
                        .build());
                    addedForTag++;
                }
            }
        }

        return WeaknessResponse.builder()
            .weakTags(weakTags)
            .recommendations(recommendations.stream().limit(40).collect(Collectors.toList()))
            .build();
    }

    @org.springframework.cache.annotation.CacheEvict(value = "weakness", key = "#userId")
    public void evictWeaknessCache(Long userId) {
        // Just evicts the cache
    }
}
