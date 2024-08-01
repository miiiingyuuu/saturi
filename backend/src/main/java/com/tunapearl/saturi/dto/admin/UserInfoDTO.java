package com.tunapearl.saturi.dto.admin;

import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.domain.user.Role;
import com.tunapearl.saturi.domain.user.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserInfoDTO {
    private Long userId;
    private Long locationId;
    private String email;
    private String nickname;
    private LocalDateTime regDate;
    private Long exp;
    private Gender gender;
    private Role role;
    private Long birdId;

    public UserInfoDTO(UserEntity u) {
        userId = u.getUserId();
        locationId = u.getLocation().getLocationId();
        email = u.getEmail();
        nickname = u.getNickname();
        regDate = u.getRegDate();
        exp = u.getExp();
        gender = u.getGender();
        role = u.getRole();
        birdId = u.getBird().getId();
    }
}
