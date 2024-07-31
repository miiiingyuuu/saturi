package com.tunapearl.saturi.dto.quiz;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuizResponseDto {
    private Long quizId;
    private Long locationId;
    private String question;
    private LocalDateTime creationDt;
    private Boolean isObjective;
}
