package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonGroupResultForSaveLessonGroupDTO {
    private Long lessonGroupId;
    private String lessonGroupName;
    private Long avgAccuracy;
    private Long avgSimilarity;
}
