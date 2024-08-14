package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class LessonGroupProgressByUserDTO {
    private Long lessonGroupId;
    private String lessonGroupName;
    private Long groupProgress;
    private Long avgAccuracy;
}
