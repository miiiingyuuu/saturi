package com.tunapearl.saturi.dto.lesson;

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
    private Long accentSimilarity;
    private Long pronunciationAccuracy;
    private LocalDateTime lessonDt;
    private Boolean isSkipped;
}
