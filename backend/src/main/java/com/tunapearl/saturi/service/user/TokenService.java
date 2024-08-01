package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.user.RedisEmail;
import com.tunapearl.saturi.domain.user.RedisToken;
import com.tunapearl.saturi.dto.user.UserLoginResponseDTO;
import com.tunapearl.saturi.repository.redis.EmailRepository;
import com.tunapearl.saturi.repository.redis.TokenRepository;
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

    private final TokenRepository tokenRepository;
    private final JWTUtil jwtUtil;
    private final EmailRepository emailRepository;

    public UserLoginResponseDTO saveRefreshToken(Long userId){

        String accessToken = jwtUtil.createAccessToken(userId);
        String refreshToken = jwtUtil.createRefreshToken(userId);

        tokenRepository.save(new RedisToken(userId,refreshToken));
        return new UserLoginResponseDTO(accessToken, refreshToken);
    }

    public String getRefreshToken(Long id){

        return tokenRepository.findById(id).get().getRefreshToken();
    }

    public void deleteRefreshToken(Long id){

        tokenRepository.deleteById(id);
    }
}
