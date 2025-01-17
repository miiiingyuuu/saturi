package com.tunapearl.saturi.dto.quiz;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizReadRequestDTO {
    private Long quizId;
    private Long locationId;
    private String question;
    private Boolean isObjective;
}
