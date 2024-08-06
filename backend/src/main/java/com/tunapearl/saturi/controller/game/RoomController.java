package com.tunapearl.saturi.controller.game;

import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import com.tunapearl.saturi.domain.game.Status;
import com.tunapearl.saturi.domain.game.person.PersonChatRoom;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.dto.game.GameResultRequestDTO;
import com.tunapearl.saturi.dto.game.GameTipRequestDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import com.tunapearl.saturi.repository.redis.PersonChatRoomRepository;
import com.tunapearl.saturi.service.QuizService;
import com.tunapearl.saturi.service.game.GameService;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/game")
public class RoomController {

    private final GameService gameService;
    private final JWTUtil jwtUtil;
    private final PersonChatRoomRepository personChatRoomRepository;
    private final QuizService quizService;
    private final GameRoomRepository gameRoomRepository;
    private final ChatRoomRepository chatRoomRepository;

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

    /**
     * 게임 결과 조회 :: 게임 종료
     */
    @GetMapping("/result")
    public ResponseEntity<?> getResult(@RequestHeader("Authorization") String authorization, @RequestBody GameResultRequestDTO gameResultRequestDTO ) throws UnAuthorizedException {
        log.info("Received select gameResult>> roomId:{}",gameResultRequestDTO.getRoomId());

        long userId = jwtUtil.getUserId(authorization);
        gameResultRequestDTO.setUserId(userId);

        //TODO:게임방 상태 바꿀것
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(gameResultRequestDTO.getRoomId());
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            GameRoomEntity gameRoomEntity = gameRoomRepository.findById(roomId).orElseThrow();
            gameRoomEntity.setStatus(Status.COMPLETED);
            gameRoomEntity.setEndDt(LocalDateTime.now());
        }

        return ResponseEntity.ok().body(gameService.getGameResult(gameResultRequestDTO));
    }
}
