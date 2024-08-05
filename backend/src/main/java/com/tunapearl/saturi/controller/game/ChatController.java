package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.ChatMessage;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.service.game.ChatService;
import com.tunapearl.saturi.service.game.GameService;
import com.tunapearl.saturi.service.game.RedisPublisher;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /**
     * 게임방 매칭용
     */
    //'/pub/game/room-request'로 들어오는 메시징 처리
    @MessageMapping("/room-request")
    public void matchingGame(@ModelAttribute ChatMessage message) throws UnAuthorizedException {

        //TODO: AccessToken으로 id가져올 것
//        Long userId = jwtUtil.getUserId(authorization);
//        gameMatchingRequestDTO.setUserId(userId);

        if (ChatMessage.MessageType.MATCHING.equals(message.getType())) {
            //매칭해주세요 + 입장 (listener추가)
//            chatService.matchingGame(message.getRoomId());
            //이벤트 리스너 등록했니????????
            chatService.enterChatRoom(message.getRoomId());
            //TODO:매칭된 방 알려줘야함
            message.setMessage(message.getSenderId()+"님이 대기열에 들어왔습니다.");

        }
        redisPublisher.gamePublish(chatService.getTopic(message.getRoomId()), message);//topicId로, message를 전송한다.

    }



    /**
     * 게임방 매칭용
     */
    //'/pub/game/chat'로 들어오는 메시징 처리
    @MessageMapping("/chat")
    public void progressGame(@ModelAttribute ChatMessage message) throws UnAuthorizedException {

        //TODO: AccessToken으로 id가져올 것
//        Long userId = jwtUtil.getUserId(authorization);
//        gameMatchingRequestDTO.setUserId(userId);

        if (ChatMessage.MessageType.MATCHING.equals(message.getType())) {
            //매칭해주세요 + 입장 (listener추가)
            chatService.matchingGame(message.getRoomId());

            //TODO:매칭된 방 알려줘야함
            message.setMessage(message.getSenderId()+"님이 대기열에 들어왔습니다.");

        }
        else if (ChatMessage.MessageType.ENTER.equals(message.getType())) {//입장

            chatService.enterChatRoom(message.getRoomId());
            message.setMessage(message.getSenderId()+"님이 게임에 들어왔습니다.");
        }
        else if (ChatMessage.MessageType.QUIZ.equals(message.getType())) {

            //TODO:문제 조회하는 로직 필요
            message.setMessage("문제줄게;;");
        }
        else if (ChatMessage.MessageType.CHAT.equals(message.getType())) {//채팅
            
            //정답처리, 로그 저장
            //문제 id받아와야함

            chatService.playGame(message.getRoomId());
            redisPublisher.gamePublish(chatService.getTopic(message.getRoomId()), message);

        }else if(ChatMessage.MessageType.EXIT.equals(message.getType())) {//퇴장
            
            
            message.setMessage(message.getSenderId()+"님이 게임에서 나감.");
        }

//        redisPublisher.gamePublish(chatService.getTopic(message.getRoomId()), message);//topicId로, message를 전송한다.

    }
}
