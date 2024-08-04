package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.ChatMessage;
import com.tunapearl.saturi.domain.game.RoomMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisPublisher {

    private final RedisTemplate<String,Object> redisTemplate;

    public void personalPublish(ChannelTopic topic, RoomMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void gamePublish(ChannelTopic topic, ChatMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
