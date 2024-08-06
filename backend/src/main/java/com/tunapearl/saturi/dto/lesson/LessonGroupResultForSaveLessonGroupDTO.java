package com.tunapearl.saturi.dto.lesson;

import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
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

    public LessonGroupResultForSaveLessonGroupDTO(LessonGroupResultEntity lessonGroupResult) {
        this.lessonGroupId = lessonGroupResult.getLessonGroup().getLessonGroupId();
        this.lessonGroupName = lessonGroupResult.getLessonGroup().getName();
        this.avgAccuracy = lessonGroupResult.getAvgAccuracy();
        this.avgSimilarity = lessonGroupResult.getAvgSimilarity();
        this.startDt = lessonGroupResult.getStartDt();
        this.endDt = lessonGroupResult.getEndDt();
        this.isCompleted = lessonGroupResult.getIsCompleted();
    }
}
