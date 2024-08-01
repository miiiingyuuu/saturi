package com.tunapearl.saturi.dto.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GameMatchingRequestDTO {

    private Long locationId;
    private Long userId;
}
