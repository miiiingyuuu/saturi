package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.quiz.QuizReadRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizReadResponseDto;
import com.tunapearl.saturi.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        log.info("GET all quiz: {}", quizReadRequestDto);
        List<QuizReadResponseDto> list = quizService.finaAll(quizReadRequestDto);
        return ResponseEntity.ok(list);
    }

    @PostMapping(value = "/quiz")
    public ResponseEntity<?> registerQuiz(@RequestBody QuizReadRequestDto quizReadRequestDto) {
        return null;
    }
}
