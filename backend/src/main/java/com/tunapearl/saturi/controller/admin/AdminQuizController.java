package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.admin.quiz.QuizUpdateRequestDTO;
import com.tunapearl.saturi.dto.quiz.QuizDetailReadResponseDTO;
import com.tunapearl.saturi.dto.quiz.QuizRandomReadRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizReadRequestDTO;
import com.tunapearl.saturi.dto.quiz.QuizReadResponseDTO;
import com.tunapearl.saturi.repository.QuizRepository;
import com.tunapearl.saturi.service.GameRoomQuizService;
import com.tunapearl.saturi.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/game")
public class AdminQuizController {

    private final QuizService quizService;
    private final GameRoomQuizService grQuizService;

    //퀴즈 조회
    @GetMapping(value = "/quiz")
    public ResponseEntity<?> getAllQuiz(@ModelAttribute("quizRequestDto") QuizReadRequestDTO quizReadRequestDto) {
        log.info("GET, get all quiz: {}", quizReadRequestDto);
        List<QuizReadResponseDTO> list = quizService.finaAll(quizReadRequestDto);
        return ResponseEntity.ok(list);
    }

    //퀴즈 상세 조회
    @GetMapping(value = "/quiz/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable(value = "quizId") Long quizId) {
        log.info("GET, get quiz: {}", quizId);
        QuizDetailReadResponseDTO quizDetailReadResponseDto = quizService.findOne(quizId);
        return ResponseEntity.ok(quizDetailReadResponseDto);
    }

    // 게임 제출용 랜덤 퀴즈 조회
    @GetMapping(value = "/quiz/random")
    public ResponseEntity<?> getRandomQuiz(@ModelAttribute QuizRandomReadRequestDto randomRequestDto){
        log.info("GET, get random quiz: {}", randomRequestDto);
        List<Long> quizIdList = quizService.findRandomIdByLocation(randomRequestDto.getLocationId());
        grQuizService.poseTenQuiz(randomRequestDto.getRoomId(), quizIdList);
        return ResponseEntity.ok(String.format("랜덤 퀴즈 10개 저장 완료: %d", randomRequestDto.getRoomId()));
    }

    //퀴즈 등록
    @PostMapping(value = "/quiz")
    public ResponseEntity<?> registerQuiz(@RequestBody QuizRegisterRequestDTO quizRegisterRequestDto) {
        log.info("POST, register quiz: {}", quizRegisterRequestDto);
        Long quizId = quizService.saveQuiz(quizRegisterRequestDto);
        return new ResponseEntity<String>("퀴즈 등록 완료",HttpStatus.CREATED);
    }

    //퀴즈 수정
    @PutMapping(value = "/quiz/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable("quizId") Long quizId
            , @RequestBody QuizUpdateRequestDTO quizUpdateRequestDto) {

        quizUpdateRequestDto.setQuizId(quizId);
        log.info("PUT, update quiz: {}", quizUpdateRequestDto);
        QuizDetailReadResponseDTO responseDto = quizService.updateQuiz(quizUpdateRequestDto);
        return ResponseEntity.ok(responseDto);
    }

    //퀴즈 삭제
    @DeleteMapping(value = "/quiz/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable("quizId") Long quizId) {
        log.info("DELETE, delete quiz: {}", quizId);
        quizService.removeOne(quizId);
        return ResponseEntity.ok("퀴즈 삭제 완료");
    }
}
