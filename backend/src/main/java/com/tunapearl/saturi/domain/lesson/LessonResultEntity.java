package com.tunapearl.saturi.domain.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.*;

@Entity
@Getter @Setter
@Table(name = "lesson_result")
public class LessonResultEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_result_id")
    private Long lessonResultId;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "lesson_id")
    private LessonEntity lesson;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "lesson_group_result_id")
    private LessonGroupResultEntity lessonGroupResult;

    @OneToOne(fetch = LAZY, mappedBy = "lessonResult")
    private LessonRecordFileEntity lessonRecordFile;

    @OneToOne(fetch = LAZY, mappedBy = "lessonResult")
    private LessonRecordGraphEntity lessonRecordGraph;

    private Long accentSimilarity; // 억양 유사도

    private Long pronunciationAccuracy; // 발음 정확도

    private LocalDateTime lessonDt; // 레슨 학습 일시

    private Boolean isSkipped; // 건너뛰기 여부
}
