package com.tunapearl.saturi.dto.admin.claim;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class ClaimReadResponseDto {
    private Long chatClaimId;
    private Long gameLogId;
    private Long userId;
    private Long roomId;
    private Long quizId;
    private String chatting;
    private LocalDateTime chattingDt;
    private LocalDateTime claimedDt;
    private Boolean isChecked;
}
