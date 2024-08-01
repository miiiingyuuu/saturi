package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.service.GameService;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameService gameService;
    private final JWTUtil jwtUtil;

    /**
     * 메시지 전달용 컨트롤러
     * 1.게임 매칭요청
     * 2.게임 채팅
     */
    //'/pub/game/matching-request/{개인방topicId}'로 들어오는 메시징 처리
    @MessageMapping("/game/matching-request")
    public void matchingGame(@ModelAttribute GameMatchingRequestDTO gameMatchingRequestDTO) throws UnAuthorizedException {

        //TODO: AccessToken으로 id가져올 것
//        log.info("accessToken: {}", authorization);
//        Long userId = jwtUtil.getUserId(authorization);
//        gameMatchingRequestDTO.setUserId(userId);
        
        //TODO: 게임방 토픽ID줄것, sub/game/matching-request/{개인방 topicId}로 보내야함
        messagingTemplate.convertAndSend("/sub/game/enter", gameService.matching(gameMatchingRequestDTO));
    }

    @MessageMapping("/game/message")
    public void game(){

        //TODO:받은 메세지들 뿌리면서 정답유무 알려줘야함
    }
}
