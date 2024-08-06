package com.tunapearl.saturi.domain.lesson;

import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "lesson_group_result")
public class LessonGroupResultEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_group_result_id")
    private Long lessonGroupResultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_group_id")
    private LessonGroupEntity lessonGroup;

    private Long avgSimilarity; // 평균 유사도

    private Long avgAccuracy; // 평균 정확도

    private LocalDateTime startDt;

    private LocalDateTime endDt;

    private Boolean isCompleted = false; // 완료 여부(true 학습완료, false 진행중)
}
