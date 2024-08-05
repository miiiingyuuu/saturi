package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.quiz.GameRoomQuizEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GameRoomQuizRepository {
    private final EntityManager em;

    public void save(GameRoomQuizEntity gameRoomQuiz){
        em.persist(gameRoomQuiz);
    }
}
