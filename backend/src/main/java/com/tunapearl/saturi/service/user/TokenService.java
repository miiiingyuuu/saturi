package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.dto.user.UserLoginResponseDTO;
import com.tunapearl.saturi.service.RedisService;
import com.tunapearl.saturi.utils.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private final RedisService redisService;
    private final JWTUtil jwtUtil;

    public UserLoginResponseDTO saveRefreshToken(Long userId){

        String accessToken = jwtUtil.createAccessToken(userId);
        String refreshToken = jwtUtil.createRefreshToken(userId);

        redisService.setData(userId.toString(),refreshToken);
        return new UserLoginResponseDTO(accessToken, refreshToken);
    }

    public String getRefreshToken(Long id){

        return redisService.getData(id.toString());
    }

    public void deleteRefreshToken(Long id){

        redisService.deleteData(id.toString());
    }
}
