package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserRecentLessonGroupDTO {
    private Long lessonGroupId;
    private String lessonGroupName;
    private Long locationId;
    private Long categoryId;
    private Long avgSimilarity;
    private Long avgAccuracy;
    private LocalDateTime startDt;
    private LocalDateTime endDt;
    private Boolean isCompleted;

    public UserRecentLessonGroupDTO(LessonGroupResultEntity lgr) {
        lessonGroupId = lgr.getLessonGroup().getLessonGroupId();
        lessonGroupName = lgr.getLessonGroup().getName();
        locationId = lgr.getLessonGroup().getLocation().getLocationId();
        categoryId = lgr.getLessonGroup().getLessonCategory().getLessonCategoryId();
        avgSimilarity = lgr.getAvgSimilarity();
        avgAccuracy = lgr.getAvgAccuracy();
        startDt = lgr.getStartDt();
        endDt = lgr.getEndDt();
        isCompleted = lgr.getIsCompleted();
    }
}
