package com.tunapearl.saturi.service.game;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.Json;
import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.domain.game.person.PersonChatMessage;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.dto.game.GameQuizChoiceDTO;
import com.tunapearl.saturi.dto.game.GameQuizResponseDTO;
import com.tunapearl.saturi.dto.game.QuizMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

            log.info("Received message from Redis: {}", message);
            // Redis에서 발행된 데이터를 받아 deserialize
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

            // 메시지 타입을 확인하기 위해 임시로 맵핑
            JsonNode jsonNode = objectMapper.readTree(publishMessage);
            String messageType = jsonNode.get("type").asText();
            log.info("Message type: {}", messageType);

            if ("PERSON".equals(messageType)) {
                PersonChatMessage personChatMessage = objectMapper.readValue(publishMessage, PersonChatMessage.class);
                messagingTemplate.convertAndSend("/sub/room-request/" + personChatMessage.getRoomId(), personChatMessage);

            } else if ("ROOM".equals(messageType)) {
                String subType = jsonNode.get("subType").asText();
                List<GameQuizResponseDTO> quizList = new ArrayList<>();

                if ("QUIZ".equals(subType)) {

                    String roomId = jsonNode.get("roomId").asText();
                    log.info("sub들어왔다요: {}", jsonNode.get("data"));

                    for(JsonNode element : jsonNode.get("data")) {
                        GameQuizResponseDTO dto = new GameQuizResponseDTO();
                        log.info("for문: {}", element);

                        for(JsonNode e: element){
                            log.info("e: {}", e.toString());

                            dto.setQuestion(e.get("question").asText());
                            dto.setQuizId(e.get("quizId").asLong());
                            dto.setIsObjective(e.get("isObjective").asBoolean());

                            List<GameQuizChoiceDTO> choices=new ArrayList<>();

                            for(JsonNode e2: e.get("quizChoiceList")){

                                GameQuizChoiceDTO choice;
                                for(JsonNode e2e: e2){
                                    log.info("e2e: {}", e2e.toString());
                                    choice=new GameQuizChoiceDTO();
                                    choice.setChoiceId(e2e.get("choiceId").asLong());
                                    choice.setChoiceText(e2e.get("choiceText").asText());
                                    choice.setIsCorrect(e2e.get("isCorrect").asBoolean());
                                    choices.add(choice);
                                    log.info("choice: {}", choice.toString());
                                }

                            }
                            dto.setQuizChoiceList(choices);
                            log.info("dto: {}", dto);
                            quizList.add(dto);
                        }

                    }
                    log.info("Sending message to room: /sub/room{}", roomId);
                    messagingTemplate.convertAndSend("/sub/room/" + roomId, quizList);
                    log.info("Message sent to room: /sub/room{}", roomId);
//                    messagingTemplate.convertAndSend("/sub/room" + roomId, quizList);
                } else {

                    ChatMessage chatMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
                    messagingTemplate.convertAndSend("/sub/room/" + chatMessage.getRoomId(), chatMessage);
                }
            } else if ("CHAT".equals(messageType)) {

                QuizMessage quizMessage = objectMapper.readValue(publishMessage, QuizMessage.class);
                messagingTemplate.convertAndSend("/sub/chat/" + quizMessage.getRoomId(), quizMessage);
            } else {
                log.error("Unknown message type: " + messageType);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

}
