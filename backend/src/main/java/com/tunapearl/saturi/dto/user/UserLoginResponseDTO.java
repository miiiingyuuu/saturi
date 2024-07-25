package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.domain.user.QuokkaEntity;
import com.tunapearl.saturi.domain.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponseDTO {
    private String accessToken;
    private String refreshToken;
}
