package com.tunapearl.saturi.dto.quiz;


import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
public class QuizRequestDto {
    private Long quizId;
    private Long locationId;
    private String question;
    private Boolean isObjective;
}
