package com.tunapearl.saturi.domain.game.room;

import com.tunapearl.saturi.domain.game.MessageType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    private String type = "ROOM";
    private String subType="";
    private MessageType chatType;
    private String roomId;
    private String senderNickName;
    private String message;
}
