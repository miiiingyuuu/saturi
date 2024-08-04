package com.tunapearl.saturi.domain.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "lesson_record_file")
public class LessonRecordFileEntity {

    @Id @GeneratedValue
    @Column(name = "lesson_record_file_id")
    private Long lessonRecordFileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_result_id")
    private LessonResultEntity lessonResult;

    private String userVoiceFileName;

    private String userVoiceFilePath;

    private String userVoiceScript;
}
