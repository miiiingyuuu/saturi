package com.tunapearl.saturi.dto.game;

import com.tunapearl.saturi.domain.game.MessageType;
import lombok.Data;

import java.util.List;

@Data
public class GameParticipantResponseDTO {

    MessageType chatType;
    private String senderNickName;
    private String message;
    private List<GameParticipantDTO> participants;
}
