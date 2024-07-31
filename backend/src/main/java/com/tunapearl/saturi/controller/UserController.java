package com.tunapearl.saturi.controller;


import com.tunapearl.saturi.dto.user.*;
import com.tunapearl.saturi.exception.*;
import com.tunapearl.saturi.service.user.SocialUserService;
import com.tunapearl.saturi.service.user.TokenService;
import com.tunapearl.saturi.service.user.UserService;
import com.tunapearl.saturi.utils.*;
import jakarta.servlet.http.HttpServletRequest;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    private final UserService userService;
    private final SocialUserService socialUserService;
    private final JWTUtil jwtUtil;
    private final TokenService tokenService;


    /**
     * 일반회원 회원가입
     */
    @PostMapping("/auth")
    public ResponseEntity<UserMsgResponseDTO> userRegister(@RequestBody @Valid UserRegisterRequestDTO request) {
        log.info("Received normal user register request for {}", request.getEmail());
        return ResponseEntity.created(URI.create("/auth")).body(userService.registerUser(request));
    }

    /**
     * 이메일 중복확인
     */
    @GetMapping("/auth/email-dupcheck")
    public ResponseEntity<UserMsgResponseDTO> userEmailDuplicateCheck(@RequestParam("email") String email) {
        log.info("Received email duplicate check request for {}", email);
        userService.validateDuplicateUserEmail(email);
        return ResponseEntity.ok().body(new UserMsgResponseDTO("ok"));
    }

    /**
     * 닉네임 중복확인
     */
    @GetMapping("/auth/nickname-dupcheck")
    public ResponseEntity<UserMsgResponseDTO> userNicknameDuplicateCheck(@RequestParam("nickname") String nickname) {
        log.info("Received nickname duplicate check request for {}", nickname);
        userService.validateDuplicateUserNickname(nickname);
        return ResponseEntity.ok().body(new UserMsgResponseDTO("ok"));
    }

    /**
     * 일반회원 로그인
     */
    @PostMapping("/auth/login")
    public ResponseEntity<UserLoginResponseDTO> userLogin(@RequestBody @Valid UserLoginRequestDTO request) {
        if(request.getUserType() == UserType.NORMAL){
            log.info("Received normal user login request for {}", request.getEmail());
            return ResponseEntity.ok().body(userService.loginUser(request));
        }
        else{
            log.info("Received social login request for {}", request.getCode());
            return ResponseEntity.created(URI.create("/auth/login")).body(socialUserService.doSocialLogin(request));
        }

    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) throws Exception, UnAuthorizedException {
        String accessToken = request.getHeader("accessToken");
        log.info("Received normal user logout request for {}", accessToken);

        userService.logoutUser(accessToken);
        return ResponseEntity.ok().body("ok");
    }

    /**
     * 회원 프로필 조회
     */
    @GetMapping("/auth/profile")
    public ResponseEntity<UserInfoResponseDTO> userProfile(@RequestHeader("Authorization") String authorization) throws UnAuthorizedException {
        Long userId = jwtUtil.getUserId(authorization);
        UserInfoResponseDTO userProfile = userService.getUserProfile(userId);
        log.info("Received user profile info response for {}", userProfile);
        return ResponseEntity.ok().body(userService.getUserProfile(userId));
    }

    /**
     * 회원 수정
     */
    @PutMapping("/auth")
    public ResponseEntity<UserMsgResponseDTO> userUpdate(@RequestHeader("Authorization") String authorization,
                                                         @RequestBody @Valid UserUpdateRequestDTO request) throws UnAuthorizedException {
        Long userId = jwtUtil.getUserId(authorization);
        log.info("Received user update request for {}", userId);
        return ResponseEntity.ok().body(userService.updateUser(userId, request));
    }

    /**
     * 회원 비밀번호 변경
     */
    @PutMapping("/auth/password-update")
    public ResponseEntity<UserMsgResponseDTO> userUpdatePassword(@RequestHeader("Authorization") String authorization,
                                                                 @RequestBody @Valid UserPasswordUpdateRequestDTO request) throws UnAuthorizedException {
        Long userId = jwtUtil.getUserId(authorization);
        log.info("Received user password update request for {}", userId);
        return ResponseEntity.ok().body(userService.updateUserPassword(userId, request));
    }

    /**
     * 회원 삭제(DB 삭제 x, 회원탈퇴 상태로 변경)
     */
    @DeleteMapping("/auth")
    public ResponseEntity<UserMsgResponseDTO> userDelete(@RequestHeader("Authorization") String authorization) throws Exception, UnAuthorizedException {
        Long userId = jwtUtil.getUserId(authorization);
        log.info("Received user delete request for {}", userId);

        tokenService.deleteRefreshToken(userId); // 토큰 삭제

        return ResponseEntity.ok().body(userService.deleteUser(userId));
    }

    /**
     * 이메일 인증 메일 전송
     */
    @PostMapping("/auth/email-valid")
    public ResponseEntity<String> emailSend(@RequestBody @Valid EmailRequestDTO request) throws MessagingException {
        log.info("Received normal user email send request for {}", request.getEmail());
        return ResponseEntity.ok().body(userService.setEmailSend(request.getEmail()));

    }

    /**
     * 이메일 인증번호 인증
     */
    @PostMapping("/auth/email-valid-code")
    public ResponseEntity<String> emailAuthCheck(@RequestBody @Valid EmailCheckDTO request) {
        log.info("Received normal user email auth check request for {}", request.getEmail());
        if (userService.checkAuthNum(request.getEmail(), request.getAuthNum())) {
            return ResponseEntity.ok().body("ok");
        } else {
            throw new NullPointerException("error!");
        }
    }

    /**
     * accessToken 유효성 검사
     */
    @GetMapping("/auth/token-check")
    public ResponseEntity<String> checkToken(HttpServletRequest request) throws Exception {

        if (jwtUtil.checkToken(request.getHeader("Authorization"))) {
            try {
                //FIXME: 반환DTO 수정 필요
                return ResponseEntity.ok().body("ok");

            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Internal Server Error");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * accessToken 재발급
     */
    @PostMapping("/auth/token-refresh")
    public ResponseEntity<TokenRefreshResponseDTO> refreshToken(HttpServletRequest request)
            throws Exception, UnAuthorizedException {

        String refreshToken = request.getHeader("refreshToken");

        if (jwtUtil.checkToken(refreshToken)) {

            Long userId = jwtUtil.getUserId(refreshToken);
            log.info("Id searched by refresh_token is {}", userId);
            log.info("refreshToken is {}", refreshToken);
            log.info("getRefreshToken is {}", tokenService.getRefreshToken(userId));
            if (refreshToken.equals(tokenService.getRefreshToken(userId))){
                log.info("Refresh token is valid");
                String accessToken = jwtUtil.createAccessToken(userId);
                return ResponseEntity.ok().body(new TokenRefreshResponseDTO(accessToken));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
