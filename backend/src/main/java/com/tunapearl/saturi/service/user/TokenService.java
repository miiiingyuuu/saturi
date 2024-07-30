package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.dto.user.UserLoginResponseDTO;
import com.tunapearl.saturi.utils.JWTUtil;
import com.tunapearl.saturi.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private final RedisUtil redisUtil;
    private final JWTUtil jwtUtil;

    public UserLoginResponseDTO saveRefreshToken(Long userId){

        String accessToken = jwtUtil.createAccessToken(userId);
        String refreshToken = jwtUtil.createRefreshToken(userId);

        redisUtil.setData(userId.toString(),refreshToken);
        return new UserLoginResponseDTO(accessToken, refreshToken);
    }

    public String getRefreshToken(Long id){

        return redisUtil.getData(id.toString());
    }

    public void deleteRefreshToken(Long id){

        redisUtil.deleteData(id.toString());
    }
}
