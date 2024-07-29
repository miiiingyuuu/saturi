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

        redisUtil.setDataExpire(userId.toString(),refreshToken,60 * 5L);
        return new UserLoginResponseDTO(accessToken, refreshToken);
    }

    public String getRefreshToken(Long id){

//        Optional<Token> tokenOptional = tokenRepository.findById(id);
//
//        if (tokenOptional.isEmpty()) {
//            throw new Exception("Refresh token not found for id: " + id);
//        }
//        else{
//            Token token = tokenOptional.get();
//            log.info("refreshToken found for id: {}", token.getRefreshToken());
//            return token.getRefreshToken();
//        }
        return redisUtil.getData(id.toString());
    }

    public void deleteRefreshToken(Long id){

//        Optional<Token> registeredUser = tokenRepository.findById(id);
//        if (registeredUser.isPresent()) {
//            throw new UserExistException("[" + id + "] 등록된 사용자 입니다.");
//        }
//        tokenRepository.deleteById(id);

        redisUtil.deleteData(id.toString());
    }

}
