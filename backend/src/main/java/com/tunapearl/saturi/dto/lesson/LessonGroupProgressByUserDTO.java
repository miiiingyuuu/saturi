package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonGroupProgressByUserDTO {
    private Long lessonGroupId;
    private String lessonGroupName;
    private Long groupProgress;
    private Long avgAccuracy;
}
