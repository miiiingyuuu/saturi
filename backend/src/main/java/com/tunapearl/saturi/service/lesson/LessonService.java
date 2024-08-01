package com.tunapearl.saturi.service.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.*;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.lesson.LessonGroupProgressByUserDTO;
import com.tunapearl.saturi.dto.lesson.LessonInfoDTO;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import com.tunapearl.saturi.service.user.UserService;
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
    private final UserService userService;
    private final UserRepository userRepository;

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

    // FIXME 레슨 수정을 수정
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
        // userId로 유저 객체 찾기
        UserEntity findUser = userService.findById(userId);
        // lessonGroupId로 레슨 그룹 객체 찾기
        LessonGroupEntity findLessonGroup = lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);

        // 이미 레슨그룹결과가 있는지 확인
        Optional<List<LessonGroupResultEntity>> getLessonGroupResult = lessonRepository.findLessonGroupResultByUserIdAndLessonGroupId(userId, lessonGroupId);
        if(getLessonGroupResult.isPresent()) {
            return getLessonGroupResult.get().get(0).getLessonGroupResultId();
        }

        // 유저, 레슨그룹, 레슨 그룹 시작 일시 설정, 완료 여부 false
        LessonGroupResultEntity lessonGroupResult = createLessonGroupResult(findUser, findLessonGroup);
        return lessonRepository.createLessonGroupResult(lessonGroupResult).orElse(null);
    }

    private static LessonGroupResultEntity createLessonGroupResult(UserEntity findUser, LessonGroupEntity findLessonGroup) {
        LessonGroupResultEntity lessonGroupResult = new LessonGroupResultEntity();
        lessonGroupResult.setUser(findUser);
        lessonGroupResult.setLessonGroup(findLessonGroup);
        lessonGroupResult.setStartDt(LocalDateTime.now());
        lessonGroupResult.setIsCompleted(false);
        return lessonGroupResult;
    }

    public Optional<LessonInfoDTO> getLessonInfoForUser(Long userId, Long lessonId) {
        // 레슨 아이디로 레슨 조회해서 레슨 그룹 아이디 조회
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);

        // 유저 아이디와 레슨 그룹 아이디로 레슨 그룹 결과 조회
        List<LessonGroupResultEntity> lessonGroupResults = lessonRepository.findLessonGroupResultByUserId(userId).orElse(null);
        Long lessonGroupResultId = findLessonGroupResultId(lessonGroupResults, lessonId);

        // 레슨 아이디랑 레슨 그룹 결과 아이디로 레슨 결과 조회
        Optional<List<LessonResultEntity>> lessonResults = lessonRepository.findLessonResultByLessonIdAndLessonGroupResultId(lessonId, lessonGroupResultId);

        // 결과가 없으면 null 반환
        if(lessonResults.isEmpty()) return Optional.empty();

        // 결과가 있는데 건너뛰기 한거면 건너뛰기로 데이터 반환
        LessonResultEntity lessonResult = lessonResults.orElse(null).get(0);
        if(lessonResult.getIsSkipped()) {
            return Optional.ofNullable(new LessonInfoDTO(true, null, null));
        }
        return Optional.ofNullable(new LessonInfoDTO(false, lessonResult.getAccentSimilarity(), lessonResult.getPronunciationAccuracy()));
    }

    public Long saveLesson(Long userId, Long lessonId, Long lessonGroupResultId, String filePath, Long accentSimilarity, Long pronunciationAccuracy, String script) {
        // 레슨 아이디로 레슨 객체 조회
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);

        // 레슨그룹결과아이디로 레슨그룹결과 객체 조회
        LessonGroupResultEntity findLessonGroupResult = lessonRepository.findLessonGroupResultById(lessonGroupResultId).orElse(null);

        // 레슨 아이디, 레슨그룹결과 아이디, 기타 정보 저장(건너뛰기 false, 레슨 학습 일시, 나머지)
        LessonResultEntity lessonResult = createLessonResult(findLesson, findLessonGroupResult, filePath, script, accentSimilarity, pronunciationAccuracy);
        return lessonRepository.saveLessonResult(lessonResult).orElse(null);
    }

    private LessonResultEntity createLessonResult(LessonEntity lesson, LessonGroupResultEntity lessonGroupResult, String filePath, String script, Long accentSimilarity, Long pronunciationAccuracy) {
        LessonResultEntity lessonResult = new LessonResultEntity();
        lessonResult.setLesson(lesson);
        lessonResult.setLessonGroupResult(lessonGroupResult);
        lessonResult.setUserVoicePath(filePath);
        lessonResult.setUserVoiceScript(script);
        lessonResult.setAccentSimilarity(accentSimilarity);
        lessonResult.setPronunciationAccuracy(pronunciationAccuracy);
        lessonResult.setLessonDt(LocalDateTime.now());
        lessonResult.setIsSkipped(false);
        return lessonResult;
    }

    public Long saveClaim(Long userId, Long lessonId, String content) {
        LessonClaimEntity lessonClaim = new LessonClaimEntity();
        UserEntity user = userRepository.findByUserId(userId).orElse(null);
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);
        lessonClaim.setUser(user);
        lessonClaim.setLesson(lesson);
        lessonClaim.setContent(content);
        return lessonRepository.saveLessonClaim(lessonClaim).orElse(null);
    }
}
