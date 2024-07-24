package com.tunapearl.saturi.service;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.dto.user.social.KakaoUserResponse;
import com.tunapearl.saturi.dto.user.social.SocialAuthResponse;
import com.tunapearl.saturi.dto.user.social.SocialUserResponse;
import com.tunapearl.saturi.dto.user.UserType;
import com.tunapearl.saturi.exception.InvalidTokenException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoLoginServiceImpl implements SocialLoginService {

    // 스프링부트 빈 DI
    private final RestTemplate restTemplate;
    private final Map<String, AgeRange> ageMap;

    // yml 설정 파일에서 주입
    @Value("${social.client.kakao.grant-type}")
    private String grantType;
    @Value("${social.client.kakao.grant-type-refresh}")
    private String grantTypeRefresh;
    @Value("${social.client.kakao.client-id}")
    private String clientId;
    @Value("${social.client.kakao.redirect-uri}")
    private String redirectUri;
    @Value("${social.client.kakao.client-secret}")
    private String clientSecret;

    @Override
    public UserType getServiceName() {
        return UserType.KAKAO;
    }

    @Override
    public SocialAuthResponse getAccessToken(String code) {
        String url = "https://kauth.kakao.com/oauth/token";

        //헤더 셋팅
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        //바디 셋팅(code 제외 나머지는 고정값)
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", grantType);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        //요청
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<SocialAuthResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                SocialAuthResponse.class
        );
        log.info("Kakao Access Token Headers: {}", response.getHeaders());
        log.info("Kakao Access Token Response: {}", response.getBody());
        return response.getBody();
    }

    public void checkTokenValidity(String accessToken) throws InvalidTokenException, RuntimeException{
        String url = "https://kapi.kakao.com/v1/user/access_token_info";

        //헤더 셋팅
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        //토큰 검증 요청
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                String.class
        );

        if(response.getStatusCode() == HttpStatus.OK) {
            log.info("Kakao Access Token Validity OK: {}", response.getBody());
            return;
        }
        else{
            GsonJsonParser parser = new GsonJsonParser();
            Map<String, Object> map = parser.parseMap(response.getBody());
            int code = (int) map.get("code");
            String msg = (String) map.get("msg");

            if(code == -401){
                throw new InvalidTokenException(msg, accessToken);
            }
            else{
                throw new RuntimeException(msg);
            }
        }
    }

    @Override
    public SocialAuthResponse refreshAccessToken(String refreshToken) {
        String url = "https://kauth.kakao.com/oauth/token";

        //헤더 셋팅
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("pplication/x-www-form-urlencoded;charset=utf-8"));

        //바디 셋팅
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", grantTypeRefresh);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);

        //요청
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<SocialAuthResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                SocialAuthResponse.class
        );

        //응답
        return response.getBody();
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {

        //쿼리 파라미터 & URI 셋팅
        String url = "https://kapi.kakao.com/v2/user/me";

        //헤더 셋팅
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        //요청 보내기
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                String.class
        );
        log.info("Kakao user response: {}", response.getBody());

        //Json 파싱
        String jsonString = response.getBody();
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
                .create();

        //파싱한 Json으로 유저정보 뽑아내기
        KakaoUserResponse kakaoUserResponse = gson.fromJson(jsonString, KakaoUserResponse.class);
        KakaoUserResponse.KakaoUserData kakaoUserData =
                Optional.ofNullable(kakaoUserResponse.getKakao_account())
                        .orElse(KakaoUserResponse.KakaoUserData.builder().build());


        //유저정보를 DTO에 감싸서 반환
        Gender gender = (kakaoUserData.getGender().equals("FEMALE"))?(Gender.FEMALE):(Gender.MALE);
        return SocialUserResponse.builder()
                .nickname(kakaoUserData.getProfile().getNickname())
                .email(kakaoUserData.getEmail())
                .gender(gender)
                .ageRange(ageMap.get(kakaoUserData.getAgeRange()))
                .build();
    }
}
