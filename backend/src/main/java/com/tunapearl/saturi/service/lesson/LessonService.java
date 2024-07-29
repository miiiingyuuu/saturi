package com.tunapearl.saturi.service.lesson;

import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonCategoryEntity findByIdLessonCategory(Long lessonCategoryId) {
        return lessonRepository.findByIdLessonCategory(lessonCategoryId).orElse(null);
    }

    public List<LessonCategoryEntity> findAllLessonCategory() {
        return lessonRepository.findAllLessonCategory().orElse(null);
    }

    public LessonGroupEntity findByIdLessonGroup(Long lessonGroupId) {
        return lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);
    }

    public List<LessonGroupEntity> findAllLessonGroup() {
        return lessonRepository.findAllLessonGroup().orElse(null);
    }
}
