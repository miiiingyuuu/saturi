package com.tunapearl.saturi.dto.game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameParticipantDTO {
    private String nickName;
    private long birdId;
}
