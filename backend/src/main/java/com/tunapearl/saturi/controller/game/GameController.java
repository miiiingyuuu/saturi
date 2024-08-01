package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.GameRoomTopic;
import com.tunapearl.saturi.domain.game.PersonTopic;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.dto.game.GameTipRequestDTO;
import com.tunapearl.saturi.dto.user.UserMsgResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.service.GameService;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final JWTUtil jwtUtil;

    /**
     * 게임 매칭
     */
    @PostMapping("/room/in")
    public ResponseEntity<GameMatchingResponseDTO> matchingRoom(@RequestHeader("Authorization") String authorization,@RequestBody GameMatchingRequestDTO request) throws UnAuthorizedException {

        long userId = jwtUtil.getUserId(authorization);
        request.setUserId(userId);
        //TODO: 개인방 TopicId준다.
        PersonTopic topic= PersonTopic.create(userId);
        GameMatchingResponseDTO responseDTO=new GameMatchingResponseDTO();
        responseDTO.setTopicId(topic.getPersonTopicId());
        return ResponseEntity.ok().body(responseDTO);
    }

    /**
     * 팁 등록
     */
    @PostMapping("/tip")
    public ResponseEntity<?> userTip(@RequestBody GameTipRequestDTO request) {

        log.info("Received insert gameTip for {}", request.getContent());
        gameService.registTip(request.getContent());
        return null;
    }

    /**
     * 팁 조회
     */
    @GetMapping("/tip")
    public ResponseEntity<?> getTip() {
        log.info("Received select gameTip");

        try {
            return ResponseEntity.ok().body(gameService.getTip());
        }catch(Exception e) {
            throw new RuntimeException("Error getting gameTip", e);
        }
    }
}
