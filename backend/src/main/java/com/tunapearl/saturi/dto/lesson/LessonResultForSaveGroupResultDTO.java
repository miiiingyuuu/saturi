package com.tunapearl.saturi.dto.lesson;

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
    private String graphX;
    private String graphY;
    private Long accentSimilarity;
    private Long pronunciationAccuracy;
    private LocalDateTime lessonDt;
    private Boolean isSkipped;
    private Boolean isBeforeResult;

    public LessonResultForSaveGroupResultDTO(LessonResultEntity lessonResult, Boolean isBeforeResult) {
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
            this.graphX = null;
            this.graphY = null;
        } else {
            this.graphX = lessonResult.getLessonRecordGraph().getGraphX();
            this.graphY = lessonResult.getLessonRecordGraph().getGraphY();
        }
        this.accentSimilarity = lessonResult.getAccentSimilarity();
        this.pronunciationAccuracy = lessonResult.getPronunciationAccuracy();
        this.lessonDt = lessonResult.getLessonDt();
        this.isSkipped = lessonResult.getIsSkipped();
        this.isBeforeResult = isBeforeResult;
    }
}
