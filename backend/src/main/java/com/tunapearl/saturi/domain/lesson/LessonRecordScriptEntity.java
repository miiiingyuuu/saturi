package com.tunapearl.saturi.domain.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "lesson_record_script")
public class LessonRecordScriptEntity {

    @Id @GeneratedValue
    @Column(name = "lesson_record_script_id")
    private Long lessonRecordScriptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_result_id")
    private LessonResultEntity lessonResult;

    private String content;
}
