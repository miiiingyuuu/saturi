package com.tunapearl.saturi.dto.game;

import com.tunapearl.saturi.domain.game.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameParticipantResponseDTO {
    MessageType chatType;
    private String senderNickName;
    private String message;
    private List<GameParticipantDTO> participants;

    public void addParticipant(GameParticipantDTO participant) {
        if (participants == null) {
            throw new RuntimeException(String.format("GameParticipantResponseDTO.addParticipant(GameParticipantDTO) called with null participants"));
        }
        participants.add(participant);
    }
}
