package com.tunapearl.saturi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class LessonGroupRegisterRequestDTO {

    private Long locationId;

    private Long lessonCategoryId;

    private String name;
}
