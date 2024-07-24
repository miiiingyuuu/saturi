package com.tunapearl.saturi.dto.user.social;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KakaoUserResponse {
    @Builder.Default
    private KakaoUserData kakao_account = KakaoUserData.builder().build();

    @Builder
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KakaoUserData {
        private String gender;
        private String email;
        @JsonProperty("age_range")

        private String ageRange;

        @Builder.Default
        private KakaoProfile profile = KakaoProfile.builder().build();

        @Builder.Default
        private KakaoPropery properties = KakaoPropery.builder().build();

        @Builder
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class KakaoProfile {
            private String nickname;
        }

        @Builder
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class KakaoPropery {
            private String nickname;
        }
    }
}