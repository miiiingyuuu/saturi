package com.tunapearl.saturi.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tunapearl.saturi.domain.quiz.QQuizEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.quiz.QuizReadRequestDto;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class QuizRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public Long save(QuizEntity quiz){
        em.persist(quiz);
        return quiz.getQuizId();
    }

    public Optional<QuizEntity> findById(Long quizId){
        return Optional.ofNullable(em.find(QuizEntity.class, quizId));
    }

    public Optional<List<QuizEntity>> findByLocationId(Long locationId){
        List<QuizEntity> res =
                em.createQuery("select q from QuizEntity q where q.location.id = :locationId", QuizEntity.class)
                        .setParameter("locationId", locationId)
                        .getResultList();
        return res.isEmpty() ? Optional.empty() : Optional.of(res);
    }

    public List<QuizEntity> findAll(QuizReadRequestDto dto){
        QQuizEntity qQuiz = new QQuizEntity("q");

        return queryFactory
                .selectFrom(qQuiz)
                .where(
                        quizIdEq(qQuiz, dto.getQuizId()),
                        locationIdEq(qQuiz, dto.getLocationId()),
                        questionLike(qQuiz, dto.getQuestion()),
                        isObjectiveEq(qQuiz, dto.getIsObjective())
                ).limit(1000)
                .fetch();
    }

    public void deleteQuizById(Long quizId){
        em.remove(em.find(QuizEntity.class, quizId));
    }

    public void deleteChoiceByQuizId(Long quizId){
        em.createQuery("delete from QuizChoiceEntity c where c.quizChoicePK.quizId = :quizId")
                .setParameter("quizId", quizId)
                .executeUpdate();
        em.clear();
    }

    private BooleanExpression quizIdEq(QQuizEntity quiz, Long quizIdCond){
        if(quizIdCond == null) return null;
        return quiz.quizId.eq(quizIdCond);
    }

    private BooleanExpression locationIdEq(QQuizEntity quiz, Long locationIdCond){
        if(locationIdCond == null) return null;
        return quiz.location.locationId.eq(locationIdCond);
    }

    private BooleanExpression questionLike(QQuizEntity quiz, String questionCond){
        if(questionCond == null) return null;
        return quiz.question.contains(questionCond);
    }

    private BooleanExpression isObjectiveEq(QQuizEntity quiz, Boolean objectiveCond){
        if(objectiveCond == null) return null;
        return quiz.isObjective.eq(objectiveCond);
    }



}
