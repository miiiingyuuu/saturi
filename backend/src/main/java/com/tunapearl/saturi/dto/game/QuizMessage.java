package com.tunapearl.saturi.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizMessage {

    private String type = "CHAT";
    private String roomId;
    private Long senderId;
    private String senderNickName;
    private long quizId;
    private String message;
    private boolean isCorrect=false;
}