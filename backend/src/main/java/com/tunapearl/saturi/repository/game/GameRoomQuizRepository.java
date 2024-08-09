package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.game.GameRoomQuizEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
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

    public Optional<List<QuizEntity>> findQuizByRoomId(Long roomId){
        List<QuizEntity> results = em.createQuery("select q.quiz from GameRoomQuizEntity q where q.room.roomId = :roomId", QuizEntity.class)
                        .setParameter("roomId", roomId)
                        .getResultList();
        return results.isEmpty() ? Optional.empty() : Optional.of(results);
    }

    public Optional<GameRoomQuizEntity> findPosedQuizByRoomAndQuizId(Long quizId, Long roomId){
        GameRoomQuizEntity gameRoomQuiz = em.createQuery("select q from GameRoomQuizEntity q where q.room.roomId = :roomId and q.quiz.quizId = :quizId", GameRoomQuizEntity.class)
                .setParameter("roomId", roomId)
                .setParameter("quizId", quizId)
                .getSingleResult();
        return Optional.ofNullable(gameRoomQuiz);
    }

    public Optional<List<GameRoomQuizEntity>> findPosedQuizByRoomId(long roomId) {
        List<GameRoomQuizEntity> gameRoomQuiz = em.createQuery("select q from GameRoomQuizEntity q where q.room.roomId = :roomId", GameRoomQuizEntity.class)
                .setParameter("roomId", roomId)
                .getResultList();
        return gameRoomQuiz.isEmpty() ? Optional.empty() : Optional.of(gameRoomQuiz);
    }
}
