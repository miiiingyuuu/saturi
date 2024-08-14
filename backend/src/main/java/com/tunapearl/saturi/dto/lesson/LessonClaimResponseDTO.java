package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LessonClaimResponseDTO {
    private Long lessonClaimId;
    private Long lessonId;
    private String lessonName;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime claimDt;
}
