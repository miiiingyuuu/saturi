package com.tunapearl.saturi.dto.user.social;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NaverUserResponseDTO {

    private String resultCode;
    private String message;

    @JsonProperty("response")
    private NaverUserData naverUserData;

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class NaverUserData {
        private String nickname;
        private String email;
        private String age;
        private String gender;
    }

}
