package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonResultForSaveGroupResultDTO {
    private Long lessonId;
    private String userVoicePath;
    private String userScript;
    private Long accentSimilarity;
    private Long pronunciationAccuracy;
    private Boolean isSkipped;
}
