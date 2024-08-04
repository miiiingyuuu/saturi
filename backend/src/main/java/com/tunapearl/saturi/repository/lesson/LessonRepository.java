package com.tunapearl.saturi.repository.lesson;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.*;
import com.tunapearl.saturi.dto.lesson.LessonSaveRequestDTO;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Optional;
import java.util.List;
import java.util.OptionalDouble;

@Repository
@RequiredArgsConstructor
public class LessonRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public Optional<LessonEntity> findById(Long lessonId) {
        LessonEntity lessonEntity = em.find(LessonEntity.class, lessonId);
        return lessonEntity == null ? Optional.empty() : Optional.of(lessonEntity);
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
        QLessonGroupEntity qLessonGroup = new QLessonGroupEntity("lg");

        return Optional.ofNullable(queryFactory
                .selectFrom(qLessonGroup)
                        .join(qLessonGroup.location).fetchJoin()
                        .join(qLessonGroup.lessonCategory).fetchJoin()
                        .leftJoin(qLessonGroup.lessons).fetchJoin()
                .where(
                        locationIdEq(qLessonGroup, locationId),
                        lessonCategoryIdEq(qLessonGroup, categoryId)
                ).limit(1000)
                .fetch());
    }

    private BooleanExpression locationIdEq(QLessonGroupEntity lessonGroup, Long locationIdCond) {
        if(locationIdCond == null) return null;
        return lessonGroup.location.locationId.eq(locationIdCond);
    }

    private BooleanExpression lessonCategoryIdEq(QLessonGroupEntity lessonGroup, Long lessonCategoryId) {
        if(lessonCategoryId == null) return null;
        return lessonGroup.lessonCategory.lessonCategoryId.eq(lessonCategoryId);
    }

    public Optional<List<LessonGroupResultEntity>> findLessonGroupResultByUserId(Long userId) {
        List<LessonGroupResultEntity> lessonGroupResult = em.createQuery("select gr from LessonGroupResultEntity gr" +
                        " join fetch gr.lessonGroup lg" +
                        " where gr.user.userId = :userId and gr.isCompleted = true", LessonGroupResultEntity.class)
                .setParameter("userId", userId)
                .getResultList();

        return lessonGroupResult.isEmpty() ? Optional.empty() : Optional.of(lessonGroupResult);

    }

    public Optional<List<LessonGroupResultEntity>> findLessonGroupResultByUserIdWithoutIsCompleted(Long userId) {
        List<LessonGroupResultEntity> lessonGroupResult = em.createQuery("select gr from LessonGroupResultEntity gr" +
                        " join fetch gr.lessonGroup lg" +
                        " where gr.user.userId = :userId", LessonGroupResultEntity.class)
                .setParameter("userId", userId)
                .getResultList();
        return lessonGroupResult.isEmpty() ? Optional.empty() : Optional.of(lessonGroupResult);
    }

    public Optional<List<LessonResultEntity>> findLessonResultByLessonGroupResultId(Long lessonGroupResultId) {
        List<LessonResultEntity> lessonGroupResult = em.createQuery("select lr from LessonResultEntity lr" +
                        " join fetch lr.lessonGroupResult" +
                        " where lr.isSkipped = false and lr.lessonGroupResult.lessonGroupResultId = :lessonGroupResultId", LessonResultEntity.class)
                .setParameter("lessonGroupResultId", lessonGroupResultId)
                .getResultList();

        return lessonGroupResult.isEmpty() ? Optional.empty() : Optional.of(lessonGroupResult);
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
        List<LessonResultEntity> resultList = em.createQuery("select lr from LessonResultEntity lr " +
                        " join fetch lr.lesson" +
                        " join fetch lr.lessonGroupResult" +
                        " where lr.lesson.lessonId = :lessonId and" +
                        " lr.lessonGroupResult.lessonGroupResultId = :lessonGroupResultId", LessonResultEntity.class)
                .setParameter("lessonId", lessonId)
                .setParameter("lessonGroupResultId", lessonGroupResultId)
                .getResultList();

        return resultList.isEmpty() ? Optional.empty() : Optional.of(resultList);
    }

    public Optional<List<LessonGroupResultEntity>> findLessonGroupResultByUserIdAndLessonGroupId(Long userId, Long lessonGroupId) {
        List<LessonGroupResultEntity> result = em.createQuery("select lgr from LessonGroupResultEntity lgr" +
                        " join fetch lgr.user" +
                        " join fetch lgr.lessonGroup " +
                        " where lgr.user.userId = :userId" +
                        " and lgr.lessonGroup.lessonGroupId = :lessonGroupId", LessonGroupResultEntity.class)
                .setParameter("userId", userId)
                .setParameter("lessonGroupId", lessonGroupId)
                .getResultList();

        return result.isEmpty() ? Optional.empty() : Optional.of(result);
    }

    public Optional<Long> saveLessonResult(LessonResultEntity lessonResult) {
        em.persist(lessonResult);
        return Optional.ofNullable(lessonResult.getLessonResultId());
    }

    public Optional<Long> saveLessonClaim(LessonClaimEntity lessonClaim) {
        em.persist(lessonClaim);
        return Optional.ofNullable(lessonClaim.getLessonClaimId());
    }

    public Optional<List<LessonClaimEntity>> findAllLessonClaim() {
        List<LessonClaimEntity> lessonClaims = em.createQuery("select lc from LessonClaimEntity lc" +
                " join fetch lc.lesson l" +
                " join fetch lc.user u", LessonClaimEntity.class).getResultList();
        return lessonClaims.isEmpty() ? Optional.empty() : Optional.of(lessonClaims);
    }

    public Optional<List<LessonEntity>> findAllByLessonGroupId(Long lessonGroupId) {
        List<LessonEntity> lessonGroups = em.createQuery("select l from LessonEntity l" +
                        " join fetch l.lessonGroup lg" +
                        " where l.lessonGroup.lessonGroupId = :lessonGroupId", LessonEntity.class)
                .setParameter("lessonGroupId", lessonGroupId)
                .getResultList();
        return lessonGroups.isEmpty() ? Optional.empty() : Optional.of(lessonGroups);
    }

    public Optional<Long> saveLessonRecordFile(LessonRecordFileEntity lessonRecordFile) {
        em.persist(lessonRecordFile);
        return Optional.ofNullable(lessonRecordFile.getLessonRecordFileId());
    }

    public Optional<Long> saveLessonRecordGraph(LessonRecordGraphEntity lessonRecordGraph) {
        em.persist(lessonRecordGraph);
        return Optional.ofNullable(lessonRecordGraph.getLessonRecordGraphId());
    }

    public Optional<List<LessonGroupEntity>> findLessonGroupByLocationId(Long locationId) {
        List<LessonGroupEntity> lessonGroups = em.createQuery("select lg from LessonGroupEntity lg where lg.location.locationId = :locationId", LessonGroupEntity.class)
                .setParameter("locationId", locationId)
                .getResultList();

        return lessonGroups.isEmpty() ? Optional.empty() : Optional.of(lessonGroups);
    }

    public Optional<List<LessonGroupResultEntity>> findLessonGroupResultByLessonGroupId(Long lessonGroupId) {
        List<LessonGroupResultEntity> lessonGroupResults = em.createQuery("select lgr from LessonGroupResultEntity lgr where lgr.lessonGroup.lessonGroupId = :lessonGroupId", LessonGroupResultEntity.class)
                .setParameter("lessonGroupId", lessonGroupId)
                .getResultList();

        return lessonGroupResults.isEmpty() ? Optional.empty() : Optional.of(lessonGroupResults);
    }
}
