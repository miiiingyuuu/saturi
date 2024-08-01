package com.tunapearl.saturi.controller;

import com.sun.source.tree.LiteralTree;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.dto.admin.lesson.LessonGroupResponseDTO;
import com.tunapearl.saturi.dto.admin.lesson.LessonResponseDTO;
import com.tunapearl.saturi.dto.lesson.*;
import com.tunapearl.saturi.dto.user.UserExpAndRankDTO;
import com.tunapearl.saturi.dto.user.UserInfoResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.UserService;
import com.tunapearl.saturi.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/learn")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LessonController {

    private final LessonService lessonService;
    private final UserService userService;
    private final JWTUtil jwtUtil;

    /**
     * 모든 카테고리 조회
     */
    @GetMapping("/lesson-category")
    public ResponseEntity<List<LessonCategoryEntity>> getAllLessonCategory() {
        log.info("received request to get all lesson category");
        return ResponseEntity.ok(lessonService.findAllLessonCategory());
    }
    
    /**
     * 퍼즐 조회(지역+유형)
     * 레슨 그룹, 그룹안에 들어가있는 레슨들 정보도 같이 보냄
     */
    @GetMapping("/lesson-group")
    public ResponseEntity<List<LessonGroupResponseDTO>> getLessonGroupIdByLocationAndCategory(@RequestParam Long locationId,
                                                                                              @RequestParam Long categoryId) {
        log.info("received request to get lesson group id by location and category {}, {}", locationId, categoryId);
        List<LessonGroupEntity> lessonGroupByLocationAndCategory = lessonService.findLessonGroupByLocationAndCategory(locationId, categoryId);
        List<LessonGroupResponseDTO> result = lessonGroupByLocationAndCategory.stream()
                .map(g -> new LessonGroupResponseDTO(g)).toList();
        return ResponseEntity.ok(result);
    }

    /**
     * 레슨 개별 조회
     */
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<LessonResponseDTO> getLesson(@PathVariable Long lessonId) {
        log.info("received request to find Lesson {}", lessonId);
        LessonEntity findLesson = lessonService.findById(lessonId);
        return ResponseEntity.ok(new LessonResponseDTO(findLesson.getLessonId(),
                findLesson.getLessonGroup().getLessonGroupId(), findLesson.getLessonGroup().getName(),
                findLesson.getSampleVoicePath(), findLesson.getScript(), findLesson.getLastUpdateDt()));
    }

    /**
     * 현재 지역과 유형에 맞는 퍼즐의 유저별 정보 조회
     * 진척도, 퍼즐별(진행률, 평균 정확도), 유저 정보(경험치, 순위)
     */
    @GetMapping("/lesson-group/progress")
    public ResponseEntity<LessonGroupProgressResponseDTO> getLessonGroupProgressByUser(@RequestHeader("Authorization") String authorization,
                                                                                       @RequestParam("locationId") Long locationId,
                                                                                       @RequestParam("categoryId") Long lessonCategoryId) throws UnAuthorizedException {
        log.info("received request to get lessonGroup progress by user {}, {}", locationId, lessonCategoryId);
        Long userId = jwtUtil.getUserId(authorization);

        // 진척도
        Long resultProgress = lessonService.getProgressByUserIdLocationAndCategory(userId, locationId, lessonCategoryId);

        // 퍼즐별 진행률, 평균 정확도(유사도+정확도/2)
        List<LessonGroupProgressByUserDTO> resultLessonGroupProgressAndAvgAccuracy = lessonService.getLessonGroupProgressAndAvgAccuracy(userId, locationId, lessonCategoryId);

        // 유저 정보
        UserInfoResponseDTO userProfile = userService.getUserProfile(userId);
        Long userRank = userService.getUserRank(userId);
        UserExpAndRankDTO resultUserInfo = new UserExpAndRankDTO(userProfile.getExp(), userRank);

        return ResponseEntity.ok(new LessonGroupProgressResponseDTO(resultProgress, resultLessonGroupProgressAndAvgAccuracy, resultUserInfo));
    }

    /**
     * 레슨 건너뛰기
     */
    @PutMapping("/lesson/{lessonId}")
    public ResponseEntity<LessonMsgResponseDTO> skipLesson(@RequestHeader("Authorization") String accessToken,
                                                           @PathVariable("lessonId") Long lessonId) throws UnAuthorizedException {
        // TODO 레슨 건너뛰기 기능 구현
//        log.info("received request to skip Lesson {}", lessonId);
        Long userId = jwtUtil.getUserId(accessToken);
        Long lessonResultId = lessonService.skipLesson(userId, lessonId);
        return ResponseEntity.ok(new LessonMsgResponseDTO("ok"));
    }

    /**
     * 레슨 그룹 결과 테이블 생성
     */
    @PostMapping("/lesson-group-result")
    public ResponseEntity<CreateLessonGroupResultResponseDTO> createLessonGroupResult(@RequestHeader("Authorization") String accessToken,
                                                                                      @RequestBody CreateLessonGroupResultRequestDTO request) throws UnAuthorizedException {
        // TODO 레슨 그룹 결과 생성 기능 구현
        Long userId = jwtUtil.getUserId(accessToken);
        Long lessonGroupResultId = lessonService.createLessonGroupResult(userId, request.getLessonGroupId());
        return ResponseEntity.created(URI.create("/learn/lesson-group-result")).body(new CreateLessonGroupResultResponseDTO(lessonGroupResultId));
    }
}
