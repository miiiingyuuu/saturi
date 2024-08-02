package com.tunapearl.saturi.domain.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomMessage {

    private String type = "ROOM";//개인방인지 게임방인지 구분하기 위함
    private Long locationId;
    private String roomId;//개인방Id
    private Long senderId;
    private String matchedroomId;//게임방Id
}
