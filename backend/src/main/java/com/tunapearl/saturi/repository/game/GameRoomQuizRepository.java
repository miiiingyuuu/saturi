package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.quiz.GameRoomQuizEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GameRoomQuizRepository {
    private final EntityManager em;

    public void save(GameRoomQuizEntity gameRoomQuiz){
        em.persist(gameRoomQuiz);
    }


    public Optional<List<Long>> findQuizIdsByRoomId(Long roomId){
        List<Long> results =
                em.createQuery("select q.quiz.quizId from GameRoomQuizEntity q where q.room.roomId = :roomId", Long.class)
                        .setParameter("roomId", roomId)
                        .getResultList();

        return results.isEmpty() ? Optional.empty() : Optional.of(results);
    }
}
