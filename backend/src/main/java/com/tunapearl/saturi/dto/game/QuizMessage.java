package com.tunapearl.saturi.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizMessage {

    private String type = "CORRECT";
    private String roomId;
    private Long senderId;
    private long quizId;
    private String message;
    private boolean isCorrect=false;
}
