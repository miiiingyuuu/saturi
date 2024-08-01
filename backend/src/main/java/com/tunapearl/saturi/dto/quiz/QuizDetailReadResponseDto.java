package com.tunapearl.saturi.dto.quiz;


import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuizDetailReadResponseDto {
    private Long quizId;
    private Long locationId;
    private String question;
    private Boolean isObjective;
    private List<Choice> choiceList;

    @Builder
    @Data
    public static class Choice {
        private Long choiceId;
        private String content;
        private Boolean isAnswer;
    }
}
