package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.dto.user.UserType;
import com.tunapearl.saturi.dto.user.social.NaverUserResponse;
import com.tunapearl.saturi.dto.user.social.SocialAuthResponse;
import com.tunapearl.saturi.dto.user.social.SocialUserResponse;
import com.tunapearl.saturi.exception.InvalidTokenException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class NaverLoginServiceImpl implements SocialLoginService {

    // 스프링부트 빈 DI
    private final RestTemplate restTemplate;
    private final Map<String, AgeRange> ageRanges;

    // 내가 생성
    private MultiValueMap<String, String> body;

    // yml 설정 파일 주입
    @Value("${social.client.naver.grant-type}")
    private String grantType;
    @Value("${social.client.naver.client-id}")
    private String clientId;
    @Value("${social.client.naver.redirect-uri}")
    private String redirectUri;
    @Value("${social.client.naver.client-secret}")
    private String clientSecret;

    @PostConstruct
    public void init() {
        body = new LinkedMultiValueMap<>();
        body.add("grant_type", grantType);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
    }

    @Override
    public UserType getServiceName() {
        return UserType.NAVER;
    }

    @Override
    public SocialAuthResponse getAccessToken(String code) {

        //쿼리 파라미터 + URI 설정
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://nid.naver.com/oauth2.0/token");
        for(String key: body.keySet()){
            builder.queryParam(key, body.get(key));
        }
        URI uri = builder.queryParam("code", code).build().toUri();

        // 요청
        SocialAuthResponse response = restTemplate.getForObject(uri, SocialAuthResponse.class);

        //로깅
        log.info("Naver Access Token: {}", response.toString());
        return response;
    }

    @Override
    public void checkTokenValidity(String accessToken) throws InvalidTokenException, RuntimeException {
        return;
    }

    @Override
    public SocialAuthResponse refreshAccessToken(String refreshToken) {
        return null;
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {

        String url = "https://openapi.naver.com/v1/nid/me";

        //헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        //바디 설정(선택)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        //요청
        ResponseEntity<NaverUserResponse> response = restTemplate
                .exchange(url, HttpMethod.GET, entity, NaverUserResponse.class);
        NaverUserResponse.NaverUserData userData = response.getBody().getNaverUserData();

        //SocialUserResponse로 반환
        Gender gender;
        switch (userData.getGender()) {
            case "F": gender = Gender.FEMALE; break;
            case "M": gender = Gender.MALE; break;
            default: gender = null; break;
        }
        return SocialUserResponse.builder()
                .nickname(userData.getNickname())
                .email(userData.getEmail())
                .gender(gender)
                .ageRange(ageRanges.get(userData.getAge().replace('-', '~')))
                .build();
    }
}
