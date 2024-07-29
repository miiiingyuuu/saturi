package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponseDTO {
    private String accessToken;
    private String refreshToken;
}
