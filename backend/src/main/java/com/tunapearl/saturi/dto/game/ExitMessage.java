package com.tunapearl.saturi.dto.game;

import com.tunapearl.saturi.domain.game.MessageType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExitMessage {
    private String type = "ROOM";
    private String subType="EXIT";
    private MessageType chatType;
    private String roomId;
    private String exitNickName;//나간사람닉네임
    private long remainCount;//명명남아있는지
    private String message;
}
