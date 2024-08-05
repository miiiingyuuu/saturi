package com.tunapearl.saturi.domain.game.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER,QUIZ,CHAT,EXIT
    }

    private String type = "ROOM";
    private MessageType chatType;
    private String roomId;
    private Long senderId;
    private String message;
}
