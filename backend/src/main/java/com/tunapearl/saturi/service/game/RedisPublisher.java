package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.domain.game.person.PersonChatMessage;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.game.QuizMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisPublisher {

    private final RedisTemplate<String,Object> redisTemplate;

    public void personalPublish(ChannelTopic topic, PersonChatMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void gamePublish(ChannelTopic topic, ChatMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void quizChattingPublish(ChannelTopic topic, QuizMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void quizListPublish(ChannelTopic topic, List<QuizEntity> quizList){

        redisTemplate.convertAndSend(topic.getTopic(), quizList);
    }
}
