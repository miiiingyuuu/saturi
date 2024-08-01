package com.tunapearl.saturi.domain.lesson;

import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "lesson_claim")
public class LessonClaimEntity {
    
    @Id @GeneratedValue
    @Column(name = "lesson_claim_id")
    private Long lessonClaimId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private LessonEntity lesson;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;
    
    private String content; // 신고 내용

    private LocalDateTime claimDt;
}
