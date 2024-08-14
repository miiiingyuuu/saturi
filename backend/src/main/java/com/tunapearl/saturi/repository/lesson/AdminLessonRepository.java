package com.tunapearl.saturi.repository.lesson;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.domain.lesson.QLessonEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdminLessonRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public Long saveLesson(LessonEntity lesson) {
        em.persist(lesson);
        return lesson.getLessonId();
    }

    public Long saveLessonCategory(LessonCategoryEntity lessonCategory) {
        em.persist(lessonCategory);
        return lessonCategory.getLessonCategoryId();
    }

    public Long saveLessonGroup(LessonGroupEntity lessonGroup) {
        em.persist(lessonGroup);
        return lessonGroup.getLessonGroupId();
    }

    public Optional<List<LessonEntity>> findAll() {
        return Optional.ofNullable(em.createQuery("select l from LessonEntity l where l.isDeleted = false", LessonEntity.class)
                .getResultList());
    }

    public Optional<LessonEntity> findById(Long lessonId) {
        LessonEntity lessonEntity = em.find(LessonEntity.class, lessonId);
        return lessonEntity == null ? Optional.empty() : Optional.of(lessonEntity);
    }

    public Optional<List<LessonEntity>> findByLocationAndLessonCategory(Long lessonGroupId, Long locationId, Long lessonCategoryId, String lessonName) {
        QLessonEntity qLesson = new QLessonEntity("l");

        return Optional.ofNullable(queryFactory
                .selectFrom(qLesson)
                .where(
                        lessonGroupIdEq(qLesson, lessonGroupId),
                        locationIdEq(qLesson, locationId),
                        lessonCategoryIdEq(qLesson, lessonCategoryId),
                        lessonNameLike(qLesson, lessonName),
                        qLesson.isDeleted.eq(false)
                )
                .fetch()
        );
    }

    private BooleanExpression lessonGroupIdEq(QLessonEntity lesson, Long lessonGroupIdCond) {
        if(lessonGroupIdCond == null) return null;
        return lesson.lessonGroup.lessonGroupId.eq(lessonGroupIdCond);
    }

    private BooleanExpression locationIdEq(QLessonEntity lesson, Long locationIdCond) {
        if(locationIdCond == null) return null;
        return lesson.lessonGroup.location.locationId.eq(locationIdCond);
    }

    private BooleanExpression lessonCategoryIdEq(QLessonEntity lesson, Long lessonCategoryId) {
        if(lessonCategoryId == null) return null;
        return lesson.lessonGroup.lessonCategory.lessonCategoryId.eq(lessonCategoryId);
    }

    private BooleanExpression lessonNameLike(QLessonEntity lesson, String lessonNameCond){
        if(lessonNameCond == null) return null;
        return lesson.sampleVoiceName.contains(lessonNameCond);
    }
}
