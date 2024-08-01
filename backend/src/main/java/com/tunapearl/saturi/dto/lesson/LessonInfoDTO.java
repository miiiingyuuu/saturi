package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonInfoDTO {
    private Boolean isSkipped;
    private Long accentSimilarity;
    private Long pronunciationAccuracy;
}
