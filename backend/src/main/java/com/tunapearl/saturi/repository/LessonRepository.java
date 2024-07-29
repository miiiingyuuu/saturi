package com.tunapearl.saturi.repository;

import com.tunapearl.saturi.domain.lesson.LessonEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class LessonRepository {

    private final EntityManager em;

    public Long saveLesson(LessonEntity lesson) {
        em.persist(lesson);
        return lesson.getLessonId();
    }

}
