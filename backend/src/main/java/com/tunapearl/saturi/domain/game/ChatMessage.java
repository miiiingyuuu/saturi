package com.tunapearl.saturi.domain.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER,QUIZ,CHAT,EXIT
    }

    private String type = "CHAT";//개인방인지 게임방인지 구분하기 위함
    private MessageType chatType;
    private String roomId;
    private Long senderId;
    private String message;
}
