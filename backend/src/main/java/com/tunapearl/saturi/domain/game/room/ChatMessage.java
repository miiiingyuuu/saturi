package com.tunapearl.saturi.domain.game.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER,QUIZ,EXIT
    }

    private String type = "ROOM";
    private String subType="";
    private MessageType chatType;
    private String roomId;
    private Long senderId;
    private String message;
}
