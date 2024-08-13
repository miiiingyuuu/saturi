package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
public class UserLoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private Role role;
}
