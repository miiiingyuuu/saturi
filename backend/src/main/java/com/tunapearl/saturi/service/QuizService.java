package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.quiz.QuizRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizResponseDto;
import com.tunapearl.saturi.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public Long saveQuiz(QuizEntity quiz){
        quizRepository.save(quiz);
        return quiz.getQuizId();
    }

    public List<QuizResponseDto> finaAll(QuizRequestDto quizRequestDto){
        List<QuizEntity> list = quizRepository.findAll(quizRequestDto);
        return list.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private QuizResponseDto convertToDto(QuizEntity quizEntity){
        return QuizResponseDto.builder()
                .quizId(quizEntity.getQuizId())
                .locationId(quizEntity.getLocation().getLocationId())
                .question(quizEntity.getQuestion())
                .creationDt(quizEntity.getCreationDt())
                .isObjective(quizEntity.getIsObjective())
                .build();
    }
}
