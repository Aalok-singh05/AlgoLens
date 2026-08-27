package com.algovault.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "topic_ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "tag"}))
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String tag;

    @Column(name = "elo_rating")
    private Integer eloRating;

    @Column(name = "rd")
    private Double rd;

    @Column(name = "volatility")
    private Double volatility;

    @Column(name = "conservative_rating")
    private Integer conservativeRating;

    @Column(name = "peak_rating")
    private Integer peakRating;

    @Column(name = "problems_played")
    private Integer problemsPlayed;

    @Column(name = "last_practiced_at")
    private LocalDateTime lastPracticedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
        if (eloRating == null) eloRating = 1200;
        if (rd == null) rd = 350.0;
        if (volatility == null) volatility = 0.06;
        if (conservativeRating == null) conservativeRating = Math.max(800, (int) Math.round(eloRating - 1.96 * rd));
        if (peakRating == null) peakRating = eloRating;
        if (problemsPlayed == null) problemsPlayed = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (rd != null && eloRating != null) {
            conservativeRating = Math.max(800, (int) Math.round(eloRating - 1.96 * rd));
        }
    }
}
