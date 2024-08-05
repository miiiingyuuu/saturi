package com.tunapearl.saturi.dto.admin.claim;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClaimReadRequestDto {
    private Long gameLogId;
    private Long userId;
    private Long roomId;
    private Long quizId;
}
