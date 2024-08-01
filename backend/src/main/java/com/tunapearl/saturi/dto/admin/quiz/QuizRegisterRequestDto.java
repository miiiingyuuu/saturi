package com.tunapearl.saturi.dto.admin.quiz;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuizRegisterRequestDto {
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
