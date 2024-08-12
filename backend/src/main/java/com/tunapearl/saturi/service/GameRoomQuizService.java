package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.game.GameRoomQuizEntity;
import com.tunapearl.saturi.domain.quiz.QuizChoiceEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.GameQuizChoiceDTO;
import com.tunapearl.saturi.dto.game.GameQuizResponseDTO;
import com.tunapearl.saturi.repository.QuizRepository;
import com.tunapearl.saturi.repository.game.GameRoomQuizRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameRoomQuizService {
    private final GameRoomQuizRepository grQuizRepository;
    private final QuizRepository quizRepository;
    private final GameRoomRepository roomRepository;

    public void saveTenRandomQuiz(Long roomId, List<Long> quisIdList){
        GameRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException(String.format("존재하지 않는 게임방 ID 입니다: %d", roomId)));
        List<QuizEntity> quizList = quizRepository.findByIdList(quisIdList);

        for (QuizEntity quiz : quizList) {
            GameRoomQuizEntity grQuiz = GameRoomQuizEntity.create(room, quiz, 0L);
            grQuizRepository.save(grQuiz);
        }
    }

    public List<GameQuizResponseDTO> poseTenQuiz(Long roomId){
        List<QuizEntity> qList = grQuizRepository.findQuizByRoomId(roomId).orElseThrow(() -> new RuntimeException(String.format("Not found roomId: ", roomId)));
        return qList.stream().map(this::convertQuizEntityToGameQuizResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public void updateGameRoomQuiz(GameRoomQuizEntity gameRoomQuizEntity, UserEntity user){
        gameRoomQuizEntity.setUser(user);
        gameRoomQuizEntity.setCorrectDt(LocalDateTime.now());
    }

    private GameQuizResponseDTO convertQuizEntityToGameQuizResponseDTO(QuizEntity quizEntity){
        GameQuizResponseDTO dto = new GameQuizResponseDTO();
        dto.setQuizId(quizEntity.getQuizId());
        dto.setIsObjective(quizEntity.getIsObjective());
        dto.setQuestion(quizEntity.getQuestion());

        dto.setQuizChoiceList(quizEntity.getQuizChoiceList().stream()
                .map(choiceEntity -> new GameQuizChoiceDTO(choiceEntity.getQuizChoicePK().getChoiceId(), choiceEntity.getContent(), choiceEntity.getIsAnswer()))
                .collect(Collectors.toList()));

        return dto;
    }
}
