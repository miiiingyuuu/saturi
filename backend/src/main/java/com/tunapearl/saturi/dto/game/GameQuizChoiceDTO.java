package com.tunapearl.saturi.dto.game;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GameQuizChoiceDTO {

    private Long choiceId;
    private String choiceText;
    private Boolean isCorrect;
}
