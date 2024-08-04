package com.tunapearl.saturi.domain.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER,QUIZ,CHAT,EXIT
    }
    private String type = "CHAT";
    private MessageType chatType;
    private String roomId;
    private Long senderId;
    private String message;
}
