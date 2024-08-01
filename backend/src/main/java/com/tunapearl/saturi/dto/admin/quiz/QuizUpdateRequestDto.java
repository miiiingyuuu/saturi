package com.tunapearl.saturi.dto.admin.quiz;


import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuizUpdateRequestDto {

    @Positive
    private Long quizId;

    @NotNull @Min(1) @Max(7)
    private Long locationId;

    @NotEmpty @Size(min = 2, max = 150)
    private String question;

    @NotNull
    private Boolean isObjective;

    @NotNull
    private List<Choice> choiceList;

    @Builder
    @Data
    public static class Choice {

        @NotNull @PositiveOrZero @Max(5)
        private Long choiceId;

        @NotEmpty @Size(min = 2, max = 150)
        private String content;

        @NotNull
        private Boolean isAnswer;
    }

}
