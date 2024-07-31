package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.quiz.QuizRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizResponseDto;
import com.tunapearl.saturi.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/game")
public class QuizController {

    private final QuizService quizService;

    @GetMapping(value = "/quiz")
    public ResponseEntity<?> getAllQuiz(@ModelAttribute("quizRequestDto") QuizRequestDto quizRequestDto) {
        log.info("GET all quiz: {}", quizRequestDto);
        List<QuizResponseDto> list = quizService.finaAll(quizRequestDto);
        return ResponseEntity.ok(list);
    }
}
