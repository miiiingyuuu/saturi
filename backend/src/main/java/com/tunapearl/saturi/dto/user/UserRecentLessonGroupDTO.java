package com.tunapearl.saturi.dto.user;

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
}
