package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.ChatMessage;
import com.tunapearl.saturi.domain.game.RoomMessage;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.service.game.ChatService;
import com.tunapearl.saturi.service.game.GameService;
import com.tunapearl.saturi.service.game.RedisPublisher;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final RedisPublisher redisPublisher;
    private final SimpMessagingTemplate messagingTemplate;
    private final JWTUtil jwtUtil;
    private final GameRoomRepository gameRoomRepository;
    private final ChatService chatService;
    private final GameService gameService;

    /**
     * 게임방 매칭용
     */
    //'/pub/room-request'로 들어오는 메시징 처리
    @MessageMapping("/room-request")
    public void matchingGame(@Header("Authorization") String authorization, @ModelAttribute RoomMessage message) throws UnAuthorizedException {

        Long userId = jwtUtil.getUserId(authorization);
        message.setSenderId(userId);

        chatService.enterChatRoom(message.getRoomId());

        GameMatchingResponseDTO responseDTO=gameService.matching(new GameMatchingRequestDTO(message.getLocationId(),userId));
        message.setMatchedroomId(responseDTO.getRoomId());

        //게임방 Id 던져줌
        redisPublisher.personalPublish(chatService.getTopic(message.getRoomId()), message);
    }


    //'/pub/chat'로 들어오는 메시징 처리
    @MessageMapping("/chat")
    public void progressGame(@Header("Authorization") String authorization, @ModelAttribute ChatMessage message) throws UnAuthorizedException {

        Long userId = jwtUtil.getUserId(authorization);
        message.setSenderId(userId);

        if (ChatMessage.MessageType.ENTER.equals(message.getChatType())) {//입장

            chatService.enterChatRoom(message.getRoomId());
            message.setMessage(message.getSenderId() + "님이 입장하셨습니다.");

        } else if (ChatMessage.MessageType.QUIZ.equals(message.getChatType())) {

            //TODO:문제를 10개를 던져주죠
            message.setMessage("게임리스트를 줄거얌");
        } else if (ChatMessage.MessageType.CHAT.equals(message.getChatType())) {//채팅


            //문제 id받아와야함
            chatService.playGame(message);

            redisPublisher.gamePublish(chatService.getTopic(message.getRoomId()), message);
        }

        else if (ChatMessage.MessageType.EXIT.equals(message.getChatType())) {//퇴장


            message.setMessage(message.getSenderId() + "님이 퇴장하셨습니다.");
        }

        redisPublisher.gamePublish(chatService.getTopic(message.getRoomId()), message);

    }
}
