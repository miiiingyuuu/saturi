package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.admin.quiz.QuizUpdateRequestDTO;
import com.tunapearl.saturi.dto.quiz.QuizDetailReadResponseDTO;
import com.tunapearl.saturi.dto.quiz.QuizReadRequestDTO;
import com.tunapearl.saturi.dto.quiz.QuizReadResponseDTO;
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

    @GetMapping(value = "/quiz")
    public ResponseEntity<?> getAllQuiz(@ModelAttribute("quizRequestDto") QuizReadRequestDTO quizReadRequestDto) {
        log.info("GET, get all quiz: {}", quizReadRequestDto);
        List<QuizReadResponseDTO> list = quizService.finaAll(quizReadRequestDto);
        return ResponseEntity.ok(list);
    }

    @GetMapping(value = "/quiz/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable(value = "quizId") Long quizId) {
        log.info("GET, get quiz: {}", quizId);
        QuizDetailReadResponseDTO quizDetailReadResponseDto = quizService.findOne(quizId);
        return ResponseEntity.ok(quizDetailReadResponseDto);
    }

    @PostMapping(value = "/quiz")
    public ResponseEntity<?> registerQuiz(@RequestBody QuizRegisterRequestDTO quizRegisterRequestDto) {
        log.info("POST, register quiz: {}", quizRegisterRequestDto);
        Long quizId = quizService.saveQuiz(quizRegisterRequestDto);
        return new ResponseEntity<String>("퀴즈 등록 완료",HttpStatus.CREATED);
    }

    @PutMapping(value = "/quiz/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable("quizId") Long quizId
            , @RequestBody QuizUpdateRequestDTO quizUpdateRequestDto) {

        quizUpdateRequestDto.setQuizId(quizId);
        log.info("POST, update quiz: {}", quizUpdateRequestDto);
        QuizDetailReadResponseDTO responseDto = quizService.updateQuiz(quizUpdateRequestDto);
        return ResponseEntity.ok(responseDto);
    }
}
