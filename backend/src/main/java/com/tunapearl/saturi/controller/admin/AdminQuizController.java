package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizReadRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizReadResponseDto;
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
    public ResponseEntity<?> getAllQuiz(@ModelAttribute("quizRequestDto") QuizReadRequestDto quizReadRequestDto) {
        log.info("GET, get all quiz: {}", quizReadRequestDto);
        List<QuizReadResponseDto> list = quizService.finaAll(quizReadRequestDto);
        return ResponseEntity.ok(list);
    }

    @PostMapping(value = "/quiz")
    public ResponseEntity<?> registerQuiz(@RequestBody QuizRegisterRequestDto quizRegisterRequestDto) {
        log.info("POST, register quiz: {}", quizRegisterRequestDto);
        Long quizId = quizService.saveQuiz(quizRegisterRequestDto);
        return new ResponseEntity<String>(String.format("%l: 퀴즈 등록 완료", quizId),HttpStatus.CREATED);
    }
}
