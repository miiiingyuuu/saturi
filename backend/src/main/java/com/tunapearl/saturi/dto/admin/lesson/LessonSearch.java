package com.tunapearl.saturi.dto.admin.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class LessonSearch {
    private Long lessonGroupId;
    private Long locationId;
    private Long lessonCategoryId;
}
