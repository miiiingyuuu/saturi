package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LessonClaimResponseDTO {
    private Long lessonClaimId;
    private Long lessonId;
    private Long userId;
    private String content;
    private LocalDateTime claimDt;
}
