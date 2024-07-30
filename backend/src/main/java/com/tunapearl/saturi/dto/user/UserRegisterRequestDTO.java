package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class UserRegisterRequestDTO {
    private String email;
    private String password;
    private String nickname;
}
