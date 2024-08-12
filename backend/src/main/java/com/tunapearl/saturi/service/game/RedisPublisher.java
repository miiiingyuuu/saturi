package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.MessageType;
import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.domain.game.person.PersonChatMessage;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.game.ExitMessage;
import com.tunapearl.saturi.dto.game.GameParticipantResponseDTO;
import com.tunapearl.saturi.dto.game.GameQuizResponseDTO;
import com.tunapearl.saturi.dto.game.QuizMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisPublisher {

    private final RedisTemplate<String,Object> redisTemplate;

    public void personalPublish(ChannelTopic topic, PersonChatMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void gameStartPublish(ChannelTopic topic, GameParticipantResponseDTO responseDTO, String roomId){

        Map<String, Object> message = new HashMap<>();
        message.put("type", "ROOM");

        if(responseDTO.getChatType()== MessageType.ENTER)
            message.put("subType", "ENTER");
        else if(responseDTO.getChatType()== MessageType.START)
            message.put("subType", "START");
        else message.put("subType", "EXIT");

        message.put("roomId",roomId);
        message.put("data", responseDTO);
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
    
    public void gamePublish(ChannelTopic topic, ChatMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void quizChattingPublish(ChannelTopic topic, QuizMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void quizListPublish(ChannelTopic topic, List<GameQuizResponseDTO> quizList, String roomId){

        Map<String, Object> message = new HashMap<>();
        message.put("type", "ROOM");
        message.put("subType", "QUIZ");
        message.put("roomId",roomId);
        message.put("data", quizList);
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    public void gameExitPublish(ChannelTopic topic, ExitMessage message){

        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
