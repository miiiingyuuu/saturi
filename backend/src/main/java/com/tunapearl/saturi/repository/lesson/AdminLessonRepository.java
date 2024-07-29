package com.tunapearl.saturi.repository.lesson;

import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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
}
