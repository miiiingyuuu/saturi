package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.ChatMessage;
import com.tunapearl.saturi.domain.game.RoomMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisPublisher {

    private final RedisTemplate<String,Object> redisTemplate;

    public void personalPublish(ChannelTopic topic, RoomMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void gamePublish(ChannelTopic topic, ChatMessage message){

        log.info("RedisPublisher:: topicId: {}, message: {}", topic.getTopic(), message.getMessage());
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
