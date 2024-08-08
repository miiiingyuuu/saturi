package com.tunapearl.saturi.dto.game;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("isExited")
    private boolean isExited;
}
