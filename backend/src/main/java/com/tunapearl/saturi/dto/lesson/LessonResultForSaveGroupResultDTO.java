package com.tunapearl.saturi.dto.lesson;

import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonResultEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LessonResultForSaveGroupResultDTO {
    private Long lessonId;
    private String userVoicePath;
    private String userVoiceName;
    private String userScript;
    private String UserGraphX;
    private String UserGraphY;
    private String sampleScript;
    private String sampleGraphX;
    private String sampleGraphY;
    private Long accentSimilarity;
    private Long pronunciationAccuracy;
    private LocalDateTime lessonDt;
    private Boolean isSkipped;
    private Boolean isBeforeResult;

    public LessonResultForSaveGroupResultDTO(LessonResultEntity lessonResult, Boolean isBeforeResult, LessonEntity sampleLesson) {
        this.lessonId = lessonResult.getLesson().getLessonId();
        if(lessonResult.getLessonRecordFile() == null) {
            this.userVoicePath = null;
            this.userVoiceName = null;
            this.userScript = null;
        } else {
            this.userVoicePath = lessonResult.getLessonRecordFile().getUserVoiceFilePath();
            this.userVoiceName = lessonResult.getLessonRecordFile().getUserVoiceFileName();
            this.userScript = lessonResult.getLessonRecordFile().getUserVoiceScript();
        }
        if(lessonResult.getLessonRecordGraph() == null) {
            this.UserGraphX = null;
            this.UserGraphY = null;
        } else {
            this.UserGraphX = lessonResult.getLessonRecordGraph().getGraphX();
            this.UserGraphY = lessonResult.getLessonRecordGraph().getGraphY();
        }
        this.sampleGraphX = null;
        if(sampleLesson.getGraphY() == null) this.sampleGraphY = null;
        else this.sampleGraphY = sampleLesson.getGraphY();
        this.sampleScript = sampleLesson.getScript();
        this.accentSimilarity = lessonResult.getAccentSimilarity();
        this.pronunciationAccuracy = lessonResult.getPronunciationAccuracy();
        this.lessonDt = lessonResult.getLessonDt();
        this.isSkipped = lessonResult.getIsSkipped();
        this.isBeforeResult = isBeforeResult;
    }
}
