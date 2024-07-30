package com.tunapearl.saturi.dto.admin.lesson;

import com.tunapearl.saturi.domain.lesson.LessonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@AllArgsConstructor
@ToString
public class LessonGroupResponseDTO {
    private Long lessonGroupId;
    private String locationName;
    private String lessonCategoryName;
    private String name;
    private List<LessonEntity> lessons;
}
