package com.tunapearl.saturi.service.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.*;
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
        int completedLessonGroupCnt = 0;
        // 유저 아이디로 그룹 결과 조회(완료된거만)
        List<LessonGroupResultEntity> lessonGroupResult = lessonRepository.findLessonGroupResultByUserId(userId).orElse(null);
        // 조회된 그룹 결과를 그룹 아이디로 조회하며 지역과 대화유형이 맞는 개수를 셈
        for (LessonGroupResultEntity lgResult : lessonGroupResult) {
            log.info("뭐가 나올까 {}, {}", lgResult.getAvgAccuracy(), lgResult.getAvgSimilarity());
            LocationEntity location = lgResult.getLessonGroup().getLocation();
            LessonCategoryEntity lessonCategory = lgResult.getLessonGroup().getLessonCategory();
            log.info("location and lessonCategory {}, {}", location.getLocationId(), lessonCategory.getLessonCategoryId());
            if(location.getLocationId().equals(locationId) && lessonCategory.getLessonCategoryId().equals(lessonCategoryId)) {
                completedLessonGroupCnt++;
            }
        }
        // 그 개수 / 9 해서 진척도 리턴
        return (completedLessonGroupCnt * 100) / 9L;
    }

    public List<LessonGroupProgressByUserDTO> getLessonGroupProgressAndAvgAccuracy(Long userId, Long locationId, Long lessonCategoryId) {
        // lessonGroup 완성 여부에 상관없이 lessonGroupResult 받아오기
        List<LessonGroupResultEntity> lessonGroupResult = lessonRepository.findLessonGroupResultByUserIdWithoutIsCompleted(userId).orElse(null);
        List<LessonGroupProgressByUserDTO> result = new ArrayList<>();
        for (LessonGroupResultEntity lgResult : lessonGroupResult) {
            // lessonGroupId
            Long lessonGroupId = lgResult.getLessonGroup().getLessonGroupId();
            // groupProgress
            Long lessonGroupResultId = lgResult.getLessonGroupResultId();
            List<LessonResultEntity> lessonResults = lessonRepository.findLessonResultByLessonGroupResultId(lessonGroupResultId).orElse(null);
            Long groupProcess = (lessonResults.size() * 100) / 5L;
            // avgAccuracy
            Long avgAccuracy = (lgResult.getAvgAccuracy() + lgResult.getAvgSimilarity()) / 2L;

            LessonGroupProgressByUserDTO dto = new LessonGroupProgressByUserDTO(lessonGroupId, groupProcess, avgAccuracy);
            result.add(dto);
        }
        return result;
    }

    public Long skipLesson(Long userId, Long lessonId) {
        // 레슨아이디로 레슨그룹 아이디를 찾는다
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);
        Long lessonGroupId = findLesson.getLessonGroup().getLessonGroupId();

        // 유저아이디와 레슨그룹 아이디로 레슨그룹결과 아이디를 찾는다.
        List<LessonGroupResultEntity> lessonGroupResults = lessonRepository.findLessonGroupResultByUserId(userId).orElse(null);
        Long lessonGroupResultId = findLessonGroupResultId(lessonGroupResults, lessonId);

        // 레슨아이디와 레슨그룹결과아이디로 레슨결과를 생성한다. 이 때 isSkipped만 true로 해서 생성한다.
        LessonResultEntity lessonResultSkipped = new LessonResultEntity();
        LessonGroupResultEntity lessonGroupResult = lessonRepository.findLessonGroupResultById(lessonGroupResultId).orElse(null);
        lessonResultSkipped.setIsSkipped(true);
        lessonResultSkipped.setLesson(findLesson);
        lessonResultSkipped.setLessonGroupResult(lessonGroupResult);

        // 생성한 레슨결과를 저장하고 레슨결과아이디를 리턴한다.
        return lessonRepository.saveLessonForSkipped(lessonResultSkipped).orElse(null);
    }

    private Long findLessonGroupResultId(List<LessonGroupResultEntity> lessonGroupResults, Long lessonId) {
        for (LessonGroupResultEntity lgr : lessonGroupResults) {
            if(lgr.getLessonGroup().getLessonGroupId().equals(lessonId)) return lgr.getLessonGroupResultId();
        }
        return null;
    }

    public Long createLessonGroupResult(Long userId, Long lessonGroupId) {
        LessonGroupResultEntity lessonGroupResult = new LessonGroupResultEntity();
        // TODO lessonGroupResult 생성 기능 추가
        return lessonRepository.createLessonGroupResult(lessonGroupResult).orElse(null);
    }
}
