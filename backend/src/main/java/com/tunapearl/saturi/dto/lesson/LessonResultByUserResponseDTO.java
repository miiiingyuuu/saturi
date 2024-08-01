package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonResultByUserResponseDTO {
    private Boolean isAccessed;
    private LessonInfoDTO lessonInfo;
}
