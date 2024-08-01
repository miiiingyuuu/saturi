package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LessonSaveRequestDTO {
    private Long lessonId;
    private Long lessonGroupResultId;
    private Long accentSimilarity;
    private Long pronunciationAccuracy;
    private String filePath;
    private String script;
}
