package com.tunapearl.saturi.service.game;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tunapearl.saturi.domain.game.MessageType;
import com.tunapearl.saturi.domain.game.person.PersonChatMessage;
import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.dto.game.*;
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

            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

            JsonNode jsonNode = objectMapper.readTree(publishMessage);
            String messageType = jsonNode.get("type").asText();

            if ("PERSON".equals(messageType)) {
                PersonChatMessage personChatMessage = objectMapper.readValue(publishMessage, PersonChatMessage.class);
                messagingTemplate.convertAndSend("/sub/room-request/" + personChatMessage.getRoomId(), personChatMessage);

            } else if ("ROOM".equals(messageType)) {
                String subType = jsonNode.get("subType").asText();

                if ("QUIZ".equals(subType)) {
                    List<GameQuizResponseDTO> quizList = new ArrayList<>();

                    String roomId = jsonNode.get("roomId").asText();

                    for (JsonNode element : jsonNode.get("data")) {

                        for (JsonNode e : element) {
                            GameQuizResponseDTO dto = new GameQuizResponseDTO();
                            dto.setQuestion(e.get("question").asText());
                            dto.setQuizId(e.get("quizId").asLong());
                            dto.setIsObjective(e.get("isObjective").asBoolean());

                            List<GameQuizChoiceDTO> choices = new ArrayList<>();

                            for (JsonNode e2 : e.get("quizChoiceList")) {

                                GameQuizChoiceDTO choice;
                                for (JsonNode e2e : e2) {
                                    choice = new GameQuizChoiceDTO();
                                    choice.setChoiceId(e2e.get("choiceId").asLong());
                                    choice.setChoiceText(e2e.get("choiceText").asText());
                                    choice.setIsCorrect(e2e.get("isCorrect").asBoolean());
                                    choices.add(choice);
                                }

                            }
                            dto.setQuizChoiceList(choices);
                            quizList.add(dto);
                        }
                    }
                    messagingTemplate.convertAndSend("/sub/room/" + roomId, quizList);

                } else if ("START".equals(subType)||"ENTER".equals(subType)) {
                    JsonNode data = jsonNode.get("data");
                    String roomId = jsonNode.get("roomId").asText();

                    GameParticipantResponseDTO gprDto = GameParticipantResponseDTO.builder()
                            .chatType(jsonNode.get("subType").asText().equals("START")?MessageType.START:MessageType.ENTER)
                            .senderNickName(data.get("senderNickName").asText())
                            .message(data.get("message").asText())
                            .build();

                    JsonNode participants = data.get("participants");
                    for (JsonNode participant : participants) {
                        for (JsonNode e : participant) {
                            GameParticipantDTO gpDto = GameParticipantDTO.builder()
                                    .nickName(e.get("nickName").asText())
                                    .birdId(e.get("birdId").asLong())
                                    .isExited(e.get("isExited").asBoolean())
                                    .build();
                            log.info("gprDto: {}", gpDto);
                            gprDto.addParticipant(gpDto);
                        }
                    }

                    log.info("roomId: {}", roomId);
                    messagingTemplate.convertAndSend("/sub/room/" + roomId, gprDto);
                } else if ("EXIT".equals(subType)) {

                    ExitMessage exitMessage = objectMapper.readValue(publishMessage, ExitMessage.class);
                    messagingTemplate.convertAndSend("/sub/room/" + exitMessage.getRoomId(), exitMessage);

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
