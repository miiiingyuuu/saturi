package com.tunapearl.saturi.dto.user;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.domain.user.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserUpdateRequestDTO {
    private String nickname;
    private Long locationId;
    private Gender gender;
    private AgeRange ageRange;
    //TODO 쿼카 수정 추가
}
