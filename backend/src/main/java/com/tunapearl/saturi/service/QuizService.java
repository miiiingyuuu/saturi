package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.quiz.QuizChoiceEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDto;
import com.tunapearl.saturi.dto.admin.quiz.QuizUpdateRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizDetailReadResponseDto;
import com.tunapearl.saturi.dto.quiz.QuizReadRequestDto;
import com.tunapearl.saturi.dto.quiz.QuizReadResponseDto;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final LocationRepository locationRepository;

    public Long saveQuiz(QuizRegisterRequestDto registerRequestDto){
        LocationEntity location = locationRepository.findById(registerRequestDto.getLocationId()).orElseThrow();
        QuizEntity quiz = QuizEntity.createQuiz(
                location,
                registerRequestDto.getQuestion(),
                registerRequestDto.getIsObjective(),
                registerRequestDto.getChoiceList()
        );
        quizRepository.save(quiz);
        return quiz.getQuizId();
    }

    public List<QuizReadResponseDto> finaAll(QuizReadRequestDto quizReadRequestDto){
        List<QuizEntity> list = quizRepository.findAll(quizReadRequestDto);
        return list.stream().map(this::convertReadDtoToEntity).collect(Collectors.toList());
    }

    public QuizDetailReadResponseDto updateQuiz(QuizUpdateRequestDto updateDto) {

        // 퀴즈의 답 삭제
        quizRepository.deleteChoiceByQuizId(updateDto.getQuizId());

        // 수정하기 위한 퀴즈 조회
        QuizEntity quiz = quizRepository.findById(updateDto.getQuizId())
                .orElseThrow(()-> new RuntimeException("Quiz not found"));
        LocationEntity location = locationRepository.findById(updateDto.getLocationId())
                .orElseThrow(()-> new RuntimeException("Location not found"));

        // 명시적으로 지연로딩된 컬렉션 초기화
        quiz.getQuizChoiceList().size();

        // 퀴즈 수정
        quiz = QuizEntity.updateQuiz(quiz, updateDto, location);
        return convertEntityToDetailDto(quiz);
    }


    private QuizReadResponseDto convertReadDtoToEntity(QuizEntity quizEntity){
        return QuizReadResponseDto.builder()
                .quizId(quizEntity.getQuizId())
                .locationId(quizEntity.getLocation().getLocationId())
                .question(quizEntity.getQuestion())
                .creationDt(quizEntity.getCreationDt())
                .isObjective(quizEntity.getIsObjective())
                .build();
    }

    private QuizDetailReadResponseDto convertEntityToDetailDto(QuizEntity quizEntity){
        List<QuizDetailReadResponseDto.Choice> choiceDtoList = new ArrayList<>();
        for(QuizChoiceEntity entity: quizEntity.getQuizChoiceList()){
            QuizDetailReadResponseDto.Choice choiceDto = QuizDetailReadResponseDto.Choice.builder()
                    .choiceId(entity.getQuizChoicePK().getChoiceId())
                    .content(entity.getContent())
                    .isAnswer(entity.getIsAnswer())
                    .build();
            choiceDtoList.add(choiceDto);
        }

        return QuizDetailReadResponseDto.builder()
                .quizId(quizEntity.getQuizId())
                .locationId(quizEntity.getLocation().getLocationId())
                .question(quizEntity.getQuestion())
                .isObjective(quizEntity.getIsObjective())
                .choiceList(choiceDtoList)
                .build();
    }
}
