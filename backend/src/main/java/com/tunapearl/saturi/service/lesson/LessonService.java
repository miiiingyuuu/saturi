package com.tunapearl.saturi.service.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
import com.tunapearl.saturi.dto.lesson.LessonGroupProgressByUserDTO;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    // FIXME 파일 수정 추가
    public void updateLesson(Long lessonId, Long lessonGroupId, String script) {
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);
        LessonGroupEntity findLessonGroup = lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);
        lesson.setLessonGroup(findLessonGroup);
        lesson.setScript(script);
        lesson.setLastUpdateDt(LocalDateTime.now());
    }

    public void deleteLesson(Long lessonId) {
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);
        findLesson.setLessonGroup(null);
        findLesson.setIsDeleted(true);
        findLesson.setLastUpdateDt(LocalDateTime.now());
    }

    public List<LessonGroupEntity> findLessonGroupByLocationAndCategory(Long locationId, Long categoryId) {
        return lessonRepository.findLessonGroupByLocationAndCategory(locationId, categoryId).orElse(null);
    }

    public LessonEntity findById(Long lessonId) {
        return lessonRepository.findById(lessonId).orElse(null);
    }

    public Long getProgressByUserIdLocationAndCategory(Long userId, Long locationId, Long lessonCategoryId) {
        int completedCnt = 0;
        // 유저 아이디로 그룹 결과 조회(완료된거만)
        List<LessonGroupResultEntity> lessonGroupResult = lessonRepository.findLessonGroupResultByUserId(userId).orElse(null);
        // 조회된 그룹 결과를 그룹 아이디로 조회하며 지역과 대화유형이 맞는 개수를 셈
        for (LessonGroupResultEntity lgResult : lessonGroupResult) {
            log.info("뭐가 나올까 {}, {}", lgResult.getAvgAccuracy(), lgResult.getAvgSimilarity());
            LocationEntity location = lgResult.getLessonGroup().getLocation();
            LessonCategoryEntity lessonCategory = lgResult.getLessonGroup().getLessonCategory();
            log.info("location and lessonCategory {}, {}", location.getLocationId(), lessonCategory.getLessonCategoryId());
            if(location.getLocationId().equals(locationId) && lessonCategory.getLessonCategoryId().equals(lessonCategoryId)) {
                completedCnt++;
            }
        }
        // 그 개수 / 9 해서 진척도 리턴
        return (completedCnt * 100) / 9L;
    }

    public List<LessonGroupProgressByUserDTO> getLessonGroupProgressAndAvgAccuracy(Long userId, Long locationId, Long lessonCategoryId) {

        List<LessonGroupResultEntity> lessonGroupResult = lessonRepository.findLessonGroupResultByUserId(userId).orElse(null);
        List<LessonGroupProgressByUserDTO> result = new ArrayList<>();
        for (LessonGroupResultEntity lgResult : lessonGroupResult) {
            // lessonGroupId
            Long lessonGroupId = lgResult.getLessonGroup().getLessonGroupId();
            // groupProgress
            Long lessonGroupResultId = lgResult.getLessonGroupResultId();
            Long groupProcess = 0L;
            // avgAccuracy
            Long avgAccuracy = (lgResult.getAvgAccuracy() + lgResult.getAvgSimilarity()) / 2L;

            LessonGroupProgressByUserDTO dto = new LessonGroupProgressByUserDTO(lessonGroupId, groupProcess, avgAccuracy);
            result.add(dto);
        }
        return result;
    }
}
