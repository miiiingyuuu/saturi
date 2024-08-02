package com.tunapearl.saturi.domain.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        MATCHING,ENTER,QUIZ,CHAT,EXIT
    }
    private MessageType type;
    private String roomId;
    private Long senderId;
    private String message;
}
