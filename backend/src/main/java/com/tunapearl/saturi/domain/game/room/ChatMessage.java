package com.tunapearl.saturi.domain.game.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER,START,QUIZ,EXIT,END
    }

    private String type = "ROOM";
    private String subType="";
    private MessageType chatType;
    private String roomId;
    private String senderNickName;
    private String message;
}
