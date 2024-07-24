package com.tunapearl.saturi.dto.user.social;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class SocialUserResponse {
    private String nickname;
    private String email;
    private Gender gender;
    private AgeRange ageRange;
}
