package com.tunapearl.saturi.domain.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "lesson")
public class LessonEntity {

    @Id @GeneratedValue
    @Column(name = "lesson_id")
    private Long lessonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_group_id")
    private LessonGroupEntity lessonGroup;

    private String sampleVoicePath;

    private String script;

    private LocalDateTime lastUpdateDt;
}
