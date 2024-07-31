package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.quiz.QuizRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizResponseDto;
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
    public ResponseEntity<?> getAllQuiz(@ModelAttribute("quizRequestDto") QuizRequestDto quizRequestDto) {
        log.info("GET all quiz: {}", quizRequestDto);
        List<QuizResponseDto> list = quizService.finaAll(quizRequestDto);
        return ResponseEntity.ok(list);
    }

    @PostMapping(value = )
}
