package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.domain.user.BirdEntity;
import com.tunapearl.saturi.domain.user.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@ToString
public class UserInfoResponseDTO {
    private String email;
    private String nickname;
    private LocalDateTime regDate;
    private Long exp;
    private Gender gender;
    private Role role;
    private AgeRange ageRange;
    private Long locationId;
    private Long birdId;
}
