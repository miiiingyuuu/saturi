package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.quiz.QuizChoiceEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.admin.quiz.QuizUpdateRequestDTO;
import com.tunapearl.saturi.dto.quiz.QuizDetailReadResponseDTO;
import com.tunapearl.saturi.dto.quiz.QuizReadRequestDTO;
import com.tunapearl.saturi.dto.quiz.QuizReadResponseDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final LocationRepository locationRepository;

    // 퀴즈 조회
    public List<QuizReadResponseDTO> finaAll(QuizReadRequestDTO quizReadRequestDto){
        List<QuizEntity> list = quizRepository.findAll(quizReadRequestDto);
        return list.stream().map(this::convertReadDtoToEntity).collect(Collectors.toList());
    }

    // 퀴즈 상세 조회
    public QuizDetailReadResponseDTO findOne(Long quizId) {
        QuizEntity quiz = quizRepository.findById(quizId).orElseThrow(()->new RuntimeException("Quiz not found"));
        return this.convertEntityToDetailDto(quiz);
    }
    
    // 랜덤 퀴즈 id 조회(10개)
    public List<Long> findRandomIdByLocation(Long locationId) throws RuntimeException{
        List<Long> idList = quizRepository.getAvailableQuizId();
        if(idList.size() < 10) throw new RuntimeException(String.format("Find Ten Quiz Randomly: 문제가 부족합니다: %d", locationId));

        Collections.shuffle(idList);
        return idList.subList(0, 10);
    }

    // 퀴즈 저장
    public Long saveQuiz(QuizRegisterRequestDTO registerRequestDto){
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

    // 퀴즈 수정
    public QuizDetailReadResponseDTO updateQuiz(QuizUpdateRequestDTO updateDto) {

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

    // 퀴즈 삭제
    public void removeOne(Long quizId) {
        quizRepository.deleteQuizById(quizId);
    }

    private QuizReadResponseDTO convertReadDtoToEntity(QuizEntity quizEntity){
        return QuizReadResponseDTO.builder()
                .quizId(quizEntity.getQuizId())
                .locationId(quizEntity.getLocation().getLocationId())
                .question(quizEntity.getQuestion())
                .creationDt(quizEntity.getCreationDt())
                .isObjective(quizEntity.getIsObjective())
                .build();
    }

    private QuizDetailReadResponseDTO convertEntityToDetailDto(QuizEntity quizEntity){
        List<QuizDetailReadResponseDTO.Choice> choiceDtoList = new ArrayList<>();
        for(QuizChoiceEntity entity: quizEntity.getQuizChoiceList()){
            QuizDetailReadResponseDTO.Choice choiceDto = QuizDetailReadResponseDTO.Choice.builder()
                    .choiceId(entity.getQuizChoicePK().getChoiceId())
                    .content(entity.getContent())
                    .isAnswer(entity.getIsAnswer())
                    .build();
            choiceDtoList.add(choiceDto);
        }

        return QuizDetailReadResponseDTO.builder()
                .quizId(quizEntity.getQuizId())
                .locationId(quizEntity.getLocation().getLocationId())
                .question(quizEntity.getQuestion())
                .isObjective(quizEntity.getIsObjective())
                .choiceList(choiceDtoList)
                .build();
    }

    public List<Integer> generateUniqueRandomNumbers(int n) {
        List<Integer> numbers = new ArrayList<>();
        for(int i = 1; i <= n; i++) numbers.add(i);
        Collections.shuffle(numbers);
        return numbers.subList(0, 10);
    }

}