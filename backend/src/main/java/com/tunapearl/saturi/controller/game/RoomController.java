package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.person.PersonChatRoom;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.dto.game.GameResultRequestDTO;
import com.tunapearl.saturi.dto.game.GameTipRequestDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.redis.PersonChatRoomRepository;
import com.tunapearl.saturi.service.QuizService;
import com.tunapearl.saturi.service.game.GameService;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/game")
public class RoomController {

    private final GameService gameService;
    private final JWTUtil jwtUtil;
    private final PersonChatRoomRepository personChatRoomRepository;

    //test용임
    private final QuizService quizService;

    /**
     * 개인방 생성
     */
    @PostMapping("/room/in")
    public ResponseEntity<GameMatchingResponseDTO> getPersonRoom(@RequestHeader("Authorization") String authorization, @RequestBody GameMatchingRequestDTO request) throws UnAuthorizedException {

        long userId = jwtUtil.getUserId(authorization);
        request.setUserId(userId);

        PersonChatRoom topic = PersonChatRoom.create(userId);
        topic.setUserId(userId);
        personChatRoomRepository.save(topic);

        GameMatchingResponseDTO responseDTO = new GameMatchingResponseDTO();
        responseDTO.setRoomId(topic.getPersonchatroomId());
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
        } catch (Exception e) {
            throw new RuntimeException("Error getting gameTip", e);
        }
    }

    @PostMapping("/quiz")
    public ResponseEntity<?> registQuiz(@RequestBody QuizRegisterRequestDTO registerRequestDto) {

        quizService.saveQuiz(registerRequestDto);
        return null;
    }

    @GetMapping("/result")
    public ResponseEntity<?> getResult(@RequestBody GameResultRequestDTO gameResultRequestDTO ) {
        log.info("Received select gameResult>> roomId:{}",gameResultRequestDTO.getRoomId());

        //TODO:경험치도 올려야함
        return ResponseEntity.ok().body(gameService.getGameResult());
    }

}
