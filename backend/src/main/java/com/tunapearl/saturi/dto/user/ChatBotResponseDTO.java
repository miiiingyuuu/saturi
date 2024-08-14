package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatBotResponseDTO {
    private CodeAndMessageDTO status;
    private ChatBotResultDTO result;
}
