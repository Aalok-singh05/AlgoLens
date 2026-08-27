package com.algovault.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "revision_cards")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevisionCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    private Integer confidence; // 1-5
    @Column(name = "interval_days")
    private Double intervalDays;
    @Column(name = "ease_factor")
    private Double easeFactor;

    @Column(name = "stability")
    private Double stability;
    @Column(name = "difficulty")
    private Double difficulty;
    
    @Column(name = "next_review")
    private LocalDateTime nextReview;
    @Column(name = "last_reviewed")
    private LocalDateTime lastReviewed;
    
    @Column(name = "review_count")
    private Integer reviewCount;

    public Double getStability() {
        if (this.stability != null) return this.stability;
        return this.easeFactor;
    }

    public void setStability(Double stability) {
        this.stability = stability;
        this.easeFactor = stability;
    }

    public Double getDifficulty() {
        if (this.difficulty != null) return this.difficulty;
        if (this.confidence != null) {
            return Math.max(1.0, Math.min(10.0, 10.0 - this.confidence * 1.6));
        }
        return 5.0;
    }
}
