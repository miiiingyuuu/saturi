package com.tunapearl.saturi.dto.admin.claim;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClaimDeleteRequestDto {
    private Long chatClaimId;
}
