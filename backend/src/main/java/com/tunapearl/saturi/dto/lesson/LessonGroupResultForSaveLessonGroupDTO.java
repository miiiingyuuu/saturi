package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LessonGroupResultForSaveLessonGroupDTO {
    private Long lessonGroupId;
    private String lessonGroupName;
    private Long avgAccuracy;
    private Long avgSimilarity;
    private LocalDateTime startDt;
    private LocalDateTime endDt;
    private Boolean isCompleted;
}
