package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.domain.user.QuokkaEntity;
import com.tunapearl.saturi.domain.user.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserLoginResponseDTO {
    private Long userId; //FIXME 토큰으로 수정 필요
    private String email;
    private String nickname;
    private LocalDateTime regDate;
    private Long exp;
    private Gender gender;
    private Role role;
    private AgeRange ageRange;
    private QuokkaEntity quokka;
    //TODO 기타 데이터 추가
}