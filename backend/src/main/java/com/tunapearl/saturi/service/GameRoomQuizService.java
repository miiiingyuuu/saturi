package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.quiz.GameRoomQuizEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.repository.QuizRepository;
import com.tunapearl.saturi.repository.game.GameRoomQuizRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameRoomQuizService {

    private final GameRoomQuizRepository grQuizRepository;
    private final QuizRepository quizRepository;
    private final GameRoomRepository roomRepository;

    public void poseQuiz(Long roomId, QuizEntity quiz) {

    }

    public void poseTenQuiz(Long roomId, List<Integer> quisIdList){

//        GameRoomEntity room = roomRepository.
//        List<QuizEntity> quizList = quizRepository.findByLocationId()

    }


    private GameRoomQuizEntity convertQuizToGRQuiz(QuizEntity quiz){
        return null;
    }
}
