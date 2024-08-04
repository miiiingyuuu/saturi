package com.tunapearl.saturi.service.game;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tunapearl.saturi.domain.game.ChatMessage;
import com.tunapearl.saturi.domain.game.RoomMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;


    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Redis에서 발행된 데이터를 받아 deserialize
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

            // 메시지 타입을 확인하기 위해 임시로 맵핑
            JsonNode jsonNode = objectMapper.readTree(publishMessage);
            String messageType = jsonNode.get("type").asText();

            if ("ROOM".equals(messageType)) {
                // RoomMessage 객체로 맵핑
                RoomMessage roomMessage = objectMapper.readValue(publishMessage, RoomMessage.class);
                // WebSocket 구독자에게 채팅 메시지 전송
                messagingTemplate.convertAndSend("/sub/room-request/" + roomMessage.getRoomId(), roomMessage);
            } else if ("CHAT".equals(messageType)) {
                // ChatMessage 객체로 맵핑
                ChatMessage chatMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
                // WebSocket 구독자에게 채팅 메시지 전송
                messagingTemplate.convertAndSend("/sub/chat-request/" + chatMessage.getRoomId(), chatMessage);
            } else {
                log.error("Unknown message type: " + messageType);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

}
