package com.tunapearl.saturi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisTemplate<String,Object> redisTemplate;

    public void setData(String key, String value) {
        ValueOperations<String,String> ops = stringRedisTemplate.opsForValue();
        ops.set(key, value);
    }

    public String getData(String key) {
        ValueOperations<String,String> ops = stringRedisTemplate.opsForValue();
        return ops.get(key);
    }

    public void deleteData(String key) {
        stringRedisTemplate.delete(key);
    }

    public void setDataExpire(String key,String value,long duration){
        ValueOperations<String,String> ops = stringRedisTemplate.opsForValue();
        ops.set(key,value, Duration.ofSeconds(duration));
    }

    public void addParticipant(){

        log.info("addParticipant");
        redisTemplate.opsForList().leftPush("list1","list1testToken1");
        redisTemplate.opsForList().leftPush("list1","list1testToken2");
        redisTemplate.opsForList().leftPush("list1","list1testToken3");
        redisTemplate.opsForList().leftPush("list2","list2testToken1");
        redisTemplate.opsForList().leftPush("list2","list2testToken2");
    }
}
