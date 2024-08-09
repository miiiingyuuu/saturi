package com.tunapearl.saturi.dto.admin.claim;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ClaimDeleteRequestDto {
    private Long chatClaimId;
}
