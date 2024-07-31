package com.tunapearl.saturi.service;

import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.repository.redis.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final RedisTemplate<String,Object> redisTemplate;

    public void addParticipant(GameMatchingRequestDTO gameMatchingRequestDTO){

        log.info("addParticipant");
        String queueName="room"+gameMatchingRequestDTO.getLocationId();
        redisTemplate.opsForList().leftPush(queueName,gameMatchingRequestDTO.getUserId());
    }
}
