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
        List<GameRoomQuizEntity> qrqList = grQuizRepository.findPosedQuizByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException(String.format("Not found posed quis list: %d", roomId)));
        List<GameQuizResponseDTO> list = new ArrayList<>();

        for(GameRoomQuizEntity grQuiz : qrqList){
            // 문제 상세 조회
            QuizEntity quiz = grQuiz.getQuiz();

            // 객관식 문제 섞기
            Collections.shuffle(quiz.getQuizChoiceList());

            // 정답 찾기
            Long ansIdx = Long.valueOf(findIndexWithIsAnswerTrue(quiz.getQuizChoiceList()));

            // 수정하기
            grQuiz.setSequence(Long.valueOf(ansIdx));

            // 리스트 추가
            list.add(convertQuizEntityToGameQuizResponseDTO(quiz, ansIdx));
        }
        return list;
    }

    @Transactional
    public void updateGameRoomQuiz(GameRoomQuizEntity gameRoomQuizEntity, UserEntity user){
        gameRoomQuizEntity.setUser(user);
        gameRoomQuizEntity.setCorrectDt(LocalDateTime.now());
    }

    private int findIndexWithIsAnswerTrue(List<QuizChoiceEntity> list){
        return (IntStream.range(0, list.size())
                .filter(i -> list.get(i).getIsAnswer())
                .findFirst()
                .orElse(-1) + 1);
    }

    private GameQuizResponseDTO convertQuizEntityToGameQuizResponseDTO(QuizEntity quizEntity, Long seq){
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
