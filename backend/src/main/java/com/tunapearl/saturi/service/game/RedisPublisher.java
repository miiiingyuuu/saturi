package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisPublisher {

    private final RedisTemplate<String,Object> redisTemplate;

    public void personalpublish(ChannelTopic topic, ChatMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
