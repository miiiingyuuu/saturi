package com.tunapearl.saturi.dto.game;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class QuizMessage {

    private String type = "CHAT";
    private String roomId;
    private Long senderId;
    private String senderNickName;
    private long quizId;
    private long chatLogId;
    private String message;
    private boolean isCorrect=false;
}
