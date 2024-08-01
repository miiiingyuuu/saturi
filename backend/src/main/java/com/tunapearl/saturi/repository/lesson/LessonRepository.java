package com.tunapearl.saturi.repository.lesson;

import com.tunapearl.saturi.domain.lesson.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Optional;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class LessonRepository {

    private final EntityManager em;

    public Optional<LessonEntity> findById(Long lessonId) {
        return Optional.ofNullable(em.find(LessonEntity.class, lessonId));
    }

    public Optional<LessonCategoryEntity> findByIdLessonCategory(Long lessonCategoryId) {
        return Optional.ofNullable(em.find(LessonCategoryEntity.class, lessonCategoryId));
    }

    public Optional<List<LessonCategoryEntity>> findAllLessonCategory() {
        return Optional.ofNullable(em.createQuery("select c from LessonCategoryEntity c", LessonCategoryEntity.class)
                .getResultList());
    }

    public Optional<LessonGroupEntity> findByIdLessonGroup(Long lessonGroupId) {
        return Optional.ofNullable(em.find(LessonGroupEntity.class, lessonGroupId));
    }

    public Optional<List<LessonGroupEntity>> findAllLessonGroup() {
        return Optional.ofNullable(em.createQuery("select distinct g from LessonGroupEntity g " +
                                " join fetch g.location lo" +
                                " join fetch g.lessonCategory lc" +
                                " left join fetch g.lessons l", LessonGroupEntity.class)
                .getResultList());
    }

    public Optional<List<LessonGroupEntity>> findLessonGroupByLocationAndCategory(Long locationId, Long categoryId) {
        return Optional.ofNullable(em.createQuery("select distinct g from LessonGroupEntity g " +
                                " join fetch g.location lo" +
                                " join fetch g.lessonCategory lc" +
                                " left join fetch g.lessons l" +
                                    " where g.location.locationId = :locationId" +
                                    " and g.lessonCategory.lessonCategoryId = :categoryId", LessonGroupEntity.class)
                .setParameter("locationId", locationId)
                .setParameter("categoryId", categoryId)
                .getResultList());
    }

    public Optional<List<LessonGroupResultEntity>> findLessonGroupResultByUserId(Long userId) {
        return Optional.ofNullable(em.createQuery("select gr from LessonGroupResultEntity gr" +
                                    " join fetch gr.lessonGroup lg" +
                                    " where gr.user.userId = :userId and gr.isCompleted = true", LessonGroupResultEntity.class)
                    .setParameter("userId", userId)
                    .getResultList());

    }

    public Optional<List<LessonGroupResultEntity>> findLessonGroupResultByUserIdWithoutIsCompleted(Long userId) {
        return Optional.ofNullable(em.createQuery("select gr from LessonGroupResultEntity gr" +
                                    " join fetch gr.lessonGroup lg" +
                                    " where gr.user.userId = :userId", LessonGroupResultEntity.class)
                    .setParameter("userId", userId)
                    .getResultList());

    }

    public Optional<List<LessonResultEntity>> findLessonResultByLessonGroupResultId(Long lessonGroupResultId) {
        return Optional.ofNullable(em.createQuery("select lr from LessonResultEntity lr" +
                                    " join fetch lr.lessonGroupResult" +
                                    " where lr.isSkipped = false and lr.lessonGroupResult.lessonGroupResultId = :lessonGroupResultId", LessonResultEntity.class)
                .setParameter("lessonGroupResultId", lessonGroupResultId)
                .getResultList());


    }

    public Optional<Long> createLessonGroupResult(LessonGroupResultEntity lessonGroupResult) {
        em.persist(lessonGroupResult);
        return Optional.ofNullable(lessonGroupResult.getLessonGroupResultId());
    }

    public Optional<LessonGroupResultEntity> findLessonGroupResultById(Long lessonGroupResultId) {
        return Optional.ofNullable(em.find(LessonGroupResultEntity.class, lessonGroupResultId));
    }

    public Optional<Long> saveLessonForSkipped(LessonResultEntity lessonResultSkipped) {
        em.persist(lessonResultSkipped);
        return Optional.ofNullable(lessonResultSkipped.getLessonResultId());
    }

    public Optional<List<LessonResultEntity>> findLessonResultByLessonIdAndLessonGroupResultId(Long lessonId, Long lessonGroupResultId) {
        List resultList = em.createQuery("select lr from LessonResultEntity lr " +
                        " join fetch lr.lesson" +
                        " join fetch lr.lessonGroupResult" +
                        " where lr.lesson.lessonId = :lessonId and" +
                        " lr.lessonGroupResult.lessonGroupResultId = :lessonGroupResultId")
                .setParameter("lessonId", lessonId)
                .setParameter("lessonGroupResultId", lessonGroupResultId)
                .getResultList();

        if(resultList.isEmpty()) return Optional.empty();
        return Optional.ofNullable(resultList);
    }
}
