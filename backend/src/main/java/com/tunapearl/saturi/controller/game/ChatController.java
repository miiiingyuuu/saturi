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
    private final GameService gameService;
    private final JWTUtil jwtUtil;
    private final GameRoomRepository gameRoomRepository;
    private final ChatService chatService;

    /**
     * 메시지 전달용 컨트롤러
     * 1.게임 매칭요청
     * 2.게임 채팅
     */
    //'/pub/game/matching-request/{개인방topicId}'로 들어오는 메시징 처리
    @MessageMapping("/game/room-request")
    public void matchingGame(@ModelAttribute ChatMessage message) throws UnAuthorizedException {

        log.info("개인방들어옴: {}",message.getRoomId());
        //TODO: AccessToken으로 id가져올 것
//        Long userId = jwtUtil.getUserId(authorization);
//        gameMatchingRequestDTO.setUserId(userId);
        
        //TODO: 게임방 토픽ID줄것, sub/game/matching-request/{개인방 topicId}로 보내야함
//        messagingTemplate.convertAndSend("/sub/game/room-request", gameService.matching(gameMatchingRequestDTO));
        //TODO: PersonTopic 넘겨야함


        if (ChatMessage.MessageType.ENTER.equals(message.getType())) {
            chatService.enterChatRoom(message.getRoomId());
//            message.setMessage(message.getSenderId() + "님이 입장하셨습니다.");
        }

        redisPublisher.personalpublish(chatService.getTopic(message.getRoomId()), message);
    }

    @MessageMapping("/game/message")
    public void game(){

        //TODO:받은 메세지들 뿌리면서 정답유무 알려줘야함
    }
}
