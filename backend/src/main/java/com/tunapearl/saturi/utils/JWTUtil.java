package com.tunapearl.saturi.utils;

import com.tunapearl.saturi.exception.UnAuthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Map;

@Component
@Slf4j
public class JWTUtil {

    @Value("${spring.jwt.salt}")
    private String salt;

    @Value("${spring.jwt.access-token.expiretime}")
    private long accessTokenExpireTime;

    @Value("${spring.jwt.refresh-token.expiretime}")
    private long refreshTokenExpireTime;


    //JWT Access Token 발급
    public String createAccessToken(Long userId) {
        return create(userId, "access-token", accessTokenExpireTime);
    }

    //JWT Refresh Token 발급
    public String createRefreshToken(Long userId) {
        return create(userId, "refresh-token", refreshTokenExpireTime);
    }

    /**
     *Token 생성
     */
    private String create(Long userId, String subject, long expireTime) {

        Claims claims = Jwts.claims()
                .setSubject(subject) // 토큰 제목 설정 ex) access-token, refresh-token
                .setIssuedAt(new Date()) // 생성일 설정
                .setExpiration(new Date(System.currentTimeMillis() + expireTime));//만료일 설정 (유효기간)

//		저장할 data의 key, value
        claims.put("userId", userId);

        String jwt = Jwts.builder()
                .setHeaderParam("typ", "JWT")//Header 설정 : 토큰의 타입, 해쉬 알고리즘 정보 세팅.
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS256, this.generateKey())//Signature 설정 : secret key를 활용한 암호화.
                .compact(); // 직렬화 처리.

        return jwt;
    }

    //	Signature 설정에 들어갈 key 생성.
    private byte[] generateKey() {
        byte[] key = null;
        try {
            //charset 설정 안하면 사용자 플랫폼의 기본 인코딩 설정으로 인코딩 됨.
            key = salt.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            if (log.isInfoEnabled()) {
                e.printStackTrace();
            } else {
                log.error("Making JWT Key Error ::: {}", e.getMessage());
            }
        }
        return key;
    }

    //	전달 받은 토큰이 제대로 생성된 것인지 확인 하고 문제가 있다면 UnauthorizedException 발생.
    public boolean checkToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(this.generateKey()).parseClaimsJws(token);
            log.debug("claims: {}", claims);
            return true;
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }

    public Long getUserId(String authorization) throws UnAuthorizedException {
        Jws<Claims> claims = null;
        try {
            claims = Jwts.parser().setSigningKey(this.generateKey()).parseClaimsJws(authorization);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new UnAuthorizedException();
        }
        Map<String, Object> value = claims.getBody();
        log.info("value : {}", value);
//        return (Long) value.get("userId");
        Number userIdNumber = (Number) value.get("userId");
        return userIdNumber.longValue();
    }

}
