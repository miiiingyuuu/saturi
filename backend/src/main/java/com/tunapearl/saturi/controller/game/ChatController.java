package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.*;
import com.tunapearl.saturi.domain.game.person.PersonChatMessage;
import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.dto.game.*;
import com.tunapearl.saturi.dto.user.UserInfoResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import com.tunapearl.saturi.service.GameRoomParticipantService;
import com.tunapearl.saturi.service.GameRoomQuizService;
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

import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final RedisPublisher redisPublisher;
    private final JWTUtil jwtUtil;

    private final ChatService chatService;
    private final GameService gameService;
    private final UserService userService;
    private final GameRoomQuizService gameRoomQuizService;
    private final GameRoomParticipantService gameRoomParticipantService;

    private final ChatRoomRepository chatRoomRepository;
    private final GameRoomParticipantRepository gameRoomParticipantRepository;
    private final GameRoomRepository gameRoomRepository;


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
        UserInfoResponseDTO userProfile = userService.getUserProfile(userId);
        message.setSenderNickName(userProfile.getNickname());

        if (MessageType.ENTER.equals(message.getChatType())) {
            GameParticipantResponseDTO dto = new GameParticipantResponseDTO();

            dto.setChatType(MessageType.ENTER);
            if (chatService.enterGameRoom(message.getRoomId())) {//다 모였다
                dto.setChatType(MessageType.START);
            }

            dto.setMessage(message.getSenderNickName() + "님이 입장하셨습니다.");
            dto.setSenderNickName(message.getSenderNickName());

            //참여자정보 가져와
            List<GameRoomParticipantEntity> participantEntityList = gameRoomParticipantService.findByRoomId(message.getRoomId());
            List<GameParticipantDTO> participantDTOList = new ArrayList<>();
            for (GameRoomParticipantEntity participant : participantEntityList) {
                GameParticipantDTO participantDTO = new GameParticipantDTO();

                participantDTO.setNickName(participant.getUser().getNickname());
                participantDTO.setBirdId(participant.getUser().getBird().getId());
                participantDTO.setExited(participant.isExited());
                participantDTOList.add(participantDTO);
            }
            dto.setParticipants(participantDTOList);

            redisPublisher.gameStartPublish(chatService.getRoomTopic(message.getRoomId()), dto, message.getRoomId());

        } else if (MessageType.QUIZ.equals(message.getChatType())) {

            ChatRoom chatRoom = chatRoomRepository.findById(message.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Not found chat room"));

            Long roomId = chatRoom.getRoomId();
            List<GameQuizResponseDTO> quizDTOList = gameRoomQuizService.poseTenQuiz(roomId);
            log.info("quizDTOList: {}", quizDTOList.toString());
            redisPublisher.quizListPublish(chatService.getRoomTopic(message.getRoomId()), quizDTOList, message.getRoomId());

        } else if (MessageType.EXIT.equals(message.getChatType())) {//퇴장

            ChatRoom chatRoom = chatRoomRepository.findById(message.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Not found chat room"));

            Long roomId = chatRoom.getRoomId();
            GameRoomParticipantId grpid = new GameRoomParticipantId(roomId, userId);

            //상태 변경
            gameService.changeParticipantStatus(grpid);

            GameParticipantResponseDTO dto = new GameParticipantResponseDTO();

            dto.setChatType(MessageType.EXIT);

            dto.setMessage(message.getSenderNickName() + "님이 퇴장하셨습니다.");
            dto.setSenderNickName(message.getSenderNickName());

            //참여자정보 가져와
            List<GameRoomParticipantEntity> participantEntityList = gameRoomParticipantService.findByRoomId(message.getRoomId());
            List<GameParticipantDTO> participantDTOList = new ArrayList<>();
            int remain_cnt = 0;//남은 인원
            for (GameRoomParticipantEntity participant : participantEntityList) {
                GameParticipantDTO participantDTO = new GameParticipantDTO();

                participantDTO.setNickName(participant.getUser().getNickname());
                participantDTO.setBirdId(participant.getUser().getBird().getId());
                participantDTO.setExited(participant.isExited());
                if (!participant.isExited())
                    remain_cnt++;
                participantDTOList.add(participantDTO);
            }
            dto.setParticipants(participantDTOList);

            if (remain_cnt == 0) {
                chatService.terminateGameRoom(message.getRoomId());
            }

            redisPublisher.gameStartPublish(chatService.getRoomTopic(message.getRoomId()), dto, message.getRoomId());

        } else if (MessageType.TERMINATED.equals(message.getChatType())) {

            chatService.terminateGameRoom(message.getRoomId());
            message.setMessage("인원 부족으로 게임이 종료되었습니다.");
            redisPublisher.gamePublish(chatService.getRoomTopic(message.getRoomId()), message);
        } else {//정상종료

            chatService.endGameRoom(message.getRoomId());
            message.setMessage("게임이 종료되었습니다.");
            redisPublisher.gamePublish(chatService.getRoomTopic(message.getRoomId()), message);
        }
    }

    ///pub/chat
    @MessageMapping("/chat")
    public void progressGame(@Header("Authorization") String authorization, @ModelAttribute QuizMessage quiz) throws UnAuthorizedException {
        Long userId = jwtUtil.getUserId(authorization);
        UserInfoResponseDTO userProfile = userService.getUserProfile(userId);
        quiz.setSenderNickName(userProfile.getNickname());
        quiz.setSenderId(userId);

        chatService.enterGameRoom(quiz.getRoomId());
        quiz = chatService.playGame(quiz);

        redisPublisher.quizChattingPublish(chatService.getRoomTopic(quiz.getRoomId()), quiz);
    }
}
