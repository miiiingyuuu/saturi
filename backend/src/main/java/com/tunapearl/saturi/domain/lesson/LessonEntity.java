package com.tunapearl.saturi.domain.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter @Setter
@Table(name = "lesson")
public class LessonEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_id")
    private Long lessonId;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "lesson_group_id")
    @JsonIgnore
    private LessonGroupEntity lessonGroup;

    private String sampleVoicePath;

    private String sampleVoiceName;

    private String script;

    private String graphX;

    private String graphY;

    private LocalDateTime lastUpdateDt;

    private Boolean isDeleted = false;

    /**
     * 비즈니스 로직
     */
    public void setLessonGroup(LessonGroupEntity lessonGroup) {
        this.lessonGroup = lessonGroup;
        lessonGroup.getLessons().add(this);
    }
}
