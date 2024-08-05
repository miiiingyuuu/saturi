package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.person.PersonChatMessage;
import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.game.*;
import com.tunapearl.saturi.dto.user.UserInfoResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.game.GameRoomQuizRepository;
import com.tunapearl.saturi.service.game.ChatService;
import com.tunapearl.saturi.service.game.GameService;
import com.tunapearl.saturi.service.game.RedisPublisher;
import com.tunapearl.saturi.service.user.UserService;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final RedisPublisher redisPublisher;
    private final JWTUtil jwtUtil;
    private final ChatService chatService;
    private final GameService gameService;
    private final GameRoomQuizRepository gameRoomQuizRepository;
    private final UserService userService;

    /**
     * 게임방 매칭용
     */
    //'/pub/room-request'로 들어오는 메시징 처리
    @MessageMapping("/room-request")
    public void matchingGame(@Header("Authorization") String authorization, @ModelAttribute PersonChatMessage message) throws UnAuthorizedException {

        Long userId = jwtUtil.getUserId(authorization);
        message.setSenderId(userId);

        chatService.enterPersonRoom(message.getRoomId());

        GameMatchingResponseDTO responseDTO = gameService.matching(new GameMatchingRequestDTO(message.getLocationId(), userId));
        message.setMatchedroomId(responseDTO.getRoomId());

        redisPublisher.personalPublish(chatService.getPersonTopic(message.getRoomId()), message);
    }

    /**
     * 게임방 매칭용
     */
    //'/pub/room'로 들어오는 메시징 처리
    @MessageMapping("/room")
    public void progressGame(@Header("Authorization") String authorization, @ModelAttribute ChatMessage message) throws UnAuthorizedException {

        Long userId = jwtUtil.getUserId(authorization);
        message.setSenderId(userId);

        if (ChatMessage.MessageType.ENTER.equals(message.getChatType())) {

            chatService.enterGameRoom(message.getRoomId());
            message.setMessage(message.getSenderId() + "님이 입장하셨습니다.");

        } else if (ChatMessage.MessageType.QUIZ.equals(message.getChatType())) {


            List<QuizEntity> quizEntityList = chatService.getquizList(message.getRoomId());

            List<GameQuizResponseDTO> quizResponseDTOS = new ArrayList<>();
            for (QuizEntity quizEntity : quizEntityList) {

                GameQuizResponseDTO dto = new GameQuizResponseDTO();
                dto.setQuizId(quizEntity.getQuizId());
                dto.setQuestion(quizEntity.getQuestion());
                dto.setIsObjective(quizEntity.getIsObjective());
                dto.setQuizChoiceList(quizEntity.getQuizChoiceList().stream()
                        .map(choiceEntity -> new GameQuizChoiceDTO(choiceEntity.getQuizChoicePK().getChoiceId(), choiceEntity.getContent(), choiceEntity.getIsAnswer()))
                        .collect(Collectors.toList()));

                quizResponseDTOS.add(dto);
            }
            redisPublisher.quizListPublish(chatService.getRoomTopic(message.getRoomId()), quizResponseDTOS, message.getRoomId());

        } else if (ChatMessage.MessageType.EXIT.equals(message.getChatType())) {//퇴장


            message.setMessage(message.getSenderId() + "님이 퇴장하셨습니다.");
        }

        redisPublisher.gamePublish(chatService.getRoomTopic(message.getRoomId()), message);
    }

    ///pub/quiz
    @MessageMapping("/chat")
    public void progressGame(@Header("Authorization") String authorization, @ModelAttribute QuizMessage quiz) throws UnAuthorizedException {

        Long userId = jwtUtil.getUserId(authorization);
        UserInfoResponseDTO userProfile = userService.getUserProfile(userId);
        quiz.setSenderNickName(userProfile.getNickname());
        quiz.setSenderId(userId);


        chatService.enterGameRoom(quiz.getRoomId());
        chatService.playGame(quiz);


        redisPublisher.quizChattingPublish(chatService.getRoomTopic(quiz.getRoomId()), quiz);
    }
}
