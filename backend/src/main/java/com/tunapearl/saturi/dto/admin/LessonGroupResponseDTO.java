package com.tunapearl.saturi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class LessonGroupResponseDTO {
    private Long lessonGroupId;
    private String locationName;
    private String lessonCategoryName;
    private String name;
}
