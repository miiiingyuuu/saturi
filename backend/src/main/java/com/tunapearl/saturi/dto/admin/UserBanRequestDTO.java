package com.tunapearl.saturi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserBanRequestDTO {
    private Long userId;
    private Long banDate;
    private Long chatClaimId;
}
