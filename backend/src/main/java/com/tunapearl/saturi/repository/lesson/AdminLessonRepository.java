package com.tunapearl.saturi.repository.lesson;

import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdminLessonRepository {

    private final EntityManager em;

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
        return Optional.ofNullable(em.find(LessonEntity.class, lessonId));
    }

    public Optional<List<LessonEntity>> findByLocationAndLessonCategory(Long locationId, Long lessonCategoryId) {
        //FIXME querydsl로 지역, 유형으로 구분 동적 쿼리 생성
        return Optional.ofNullable(em.createQuery("select l from LessonEntity l where l.isDeleted = false", LessonEntity.class)
                .getResultList());
    }
}
