package com.tunapearl.saturi.interceptor;

import com.tunapearl.saturi.domain.user.Role;
import com.tunapearl.saturi.dto.user.UserInfoResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.exception.UnAuthorizedUserException;
import com.tunapearl.saturi.service.user.UserService;
import com.tunapearl.saturi.utils.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@RequiredArgsConstructor
@Component
public class AdminInterceptor implements HandlerInterceptor {

    private final JWTUtil jwtUtil;
    private final UserService userService;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("어드민 체크 인터셉터 실행 {}", request.getRequestURI());
        String accessToken = request.getHeader("Authorization");
        try {
            Long userId = jwtUtil.getUserId(accessToken);
            UserInfoResponseDTO findUser = userService.getUserProfile(userId);
            Role role = findUser.getRole();
            if(!role.equals(Role.ADMIN)) throw new UnAuthorizedUserException();
            log.info("어드민 인정");
            return true;
        } catch (UnAuthorizedException e) {
            throw new UnAuthorizedUserException(e);
        }
    }
}
