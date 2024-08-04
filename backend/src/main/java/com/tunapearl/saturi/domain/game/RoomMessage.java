package com.tunapearl.saturi.domain.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomMessage {

//    public enum MessageType {
//        MATCHING;
//    }
    private String type = "ROOM";
//    private MessageType chatType;
    private Long locationId;
    private String roomId;//개인방Id
    private Long senderId;
    private String matchedroomId;
}
