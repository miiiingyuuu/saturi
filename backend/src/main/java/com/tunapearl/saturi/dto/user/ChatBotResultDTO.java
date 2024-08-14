package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatBotResultDTO {
    private RoleAndContentDTO message;
    private Long inputLength;
    private Long outputLength;
    private String stopReason;
    private String seed;
}
