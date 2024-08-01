package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.user.Role;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.user.UserLoginRequestDTO;
import com.tunapearl.saturi.dto.user.UserLoginResponseDTO;
import com.tunapearl.saturi.dto.user.UserType;
import com.tunapearl.saturi.dto.user.social.*;
import com.tunapearl.saturi.exception.InvalidTokenException;
import com.tunapearl.saturi.repository.BirdRepository;
import com.tunapearl.saturi.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class SocialUserService {

    /* 카카오 로그인, 네이버 로그인 Service 리스트*/
    private final List<SocialLoginService> socialLoginServices;
    private final UserRepository userRepository;
    private final UserService userService;
    private final TokenService tokenService;
    private final LocationService locationService;
    private final BirdRepository birdRepository;

    @Transactional
    public UserLoginResponseDTO doSocialLogin(UserLoginRequestDTO request) {

        // 유저가 로그인 한 방식 식별
        SocialLoginService socialLoginService = getLoginService(request.getUserType());

        // 유저 토큰 정보 얻기
        SocialAuthResponseDTO authResponse = socialLoginService.getAccessToken(request.getCode());

        // 토큰 유효성 검사
        try {
            socialLoginService.checkTokenValidity(authResponse.getAccessToken());
        }
        catch (InvalidTokenException e) { //토큰 갱신
            authResponse = socialLoginService.refreshAccessToken(authResponse.getRefreshToken());
            log.info("Refresh access token: {}", authResponse.toString());
        }
        catch (RuntimeException e) {
            e.getStackTrace();
        }

        // 유저 개인 정보 얻기
        SocialUserResponseDTO userResponse = socialLoginService.getUserInfo(authResponse.getAccessToken());
        log.info("User Response: {}", userResponse);

        // 기존재 하던 계정인지 검사
        Optional<List<UserEntity>> user = userRepository.findByEmail(userResponse.getEmail());
        Long userId;
        if(user.isEmpty()) {
            userId = userRepository.saveUser(createNewUser(userResponse));
        }
        else{
            userId = user.get().get(0).getUserId();
        }

        //회원 엔티티로 JWT 생성, 반환
        log.info("User Entity: {}", userId);
        return tokenService.saveRefreshToken(userId);
    }

    /* 여러 로그인 서비스 API 중에 어떤 서비스인지 확인하는 메서드 */
    private SocialLoginService getLoginService(UserType type){
        for(SocialLoginService loginService: socialLoginServices){
            if(loginService.getServiceName().equals(type)){
                log.info("Selected login service: {}", loginService.getServiceName());
                return loginService;
            }
        }

        throw new RuntimeException("The wrong approach: No selceted Service");
    }

    private UserEntity createNewUser(SocialUserResponseDTO socialUserResponseDTO){
        UserEntity user = new UserEntity();
        user.setEmail(socialUserResponseDTO.getEmail());
        user.setPassword(null);
        user.setLocation(locationService.findById(1L));
        user.setBird(birdRepository.findById(1L).orElse(null));
        user.setNickname(socialUserResponseDTO.getNickname());
        user.setGender(socialUserResponseDTO.getGender());
        user.setAgeRange(socialUserResponseDTO.getAgeRange());
        user.setRegDate(LocalDateTime.now());
        user.setExp(0L);
        user.setRole(Role.BASIC);
        return user;
    }
}
