package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.lesson.*;
import com.tunapearl.saturi.dto.admin.lesson.LessonGroupResponseDTO;
import com.tunapearl.saturi.dto.admin.lesson.LessonResponseDTO;
import com.tunapearl.saturi.dto.lesson.*;
import com.tunapearl.saturi.dto.user.UserExpAndRankDTO;
import com.tunapearl.saturi.dto.user.UserInfoResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.UserService;
import com.tunapearl.saturi.utils.JWTUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;

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
    public ResponseEntity<List<LessonGroupResponseDTO>> getLessonGroupIdByLocationAndCategory(@ModelAttribute LocationIdAndCategoryIdDTO request) {
        Long locationId = request.getLocationId();
        Long lessonCategoryId = request.getCategoryId();
        if(locationId == null || lessonCategoryId == null) throw new IllegalArgumentException("지역 혹은 유형이 올바르지 않습니다.");
        log.info("received request to get lesson group id by location and category {}, {}", locationId, lessonCategoryId);
        List<LessonGroupEntity> lessonGroupByLocationAndCategory = lessonService.findLessonGroupByLocationAndCategory(locationId, lessonCategoryId);
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
        LessonResponseDTO lessonDTO = lessonService.createLessonDTO(findLesson);
        return ResponseEntity.ok(lessonDTO);
    }

    /**
     * 현재 지역과 유형에 맞는 퍼즐의 유저별 정보 조회                                                
     * 진척도, 퍼즐별(진행률, 평균 정확도), 유저 정보(경험치, 순위)
     */
    @GetMapping("/lesson-group/progress")
    public ResponseEntity<LessonGroupProgressResponseDTO> getLessonGroupProgressByUser(@RequestHeader("Authorization") String authorization,
                                                                                       @ModelAttribute @Valid LocationIdAndCategoryIdDTO request) throws UnAuthorizedException {
        Long locationId = request.getLocationId();
        Long lessonCategoryId = request.getCategoryId();
        if(locationId == null || lessonCategoryId == null) throw new IllegalArgumentException("지역 혹은 유형이 올바르지 않습니다.");
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
        log.info("received request to skip Lesson {}", lessonId);
        Long userId = jwtUtil.getUserId(accessToken);
        Long lessonResultId = lessonService.skipLesson(userId, lessonId);
        return ResponseEntity.ok(new LessonMsgResponseDTO("ok"));
    }

    /**
     * 레슨 그룹 결과 테이블 생성
     * 이미 생성돼있으면 복습이니까, 시간을 갱신하고 원래있던 그룹 결과 id를 반환함
     */
    @PostMapping("/lesson-group-result/{lessonGroupId}")
    public ResponseEntity<CreateLessonGroupResultResponseDTO> createLessonGroupResult(@RequestHeader("Authorization") String accessToken,
                                                                                      @PathVariable("lessonGroupId") Long lessonGroupId) throws UnAuthorizedException {
        log.info("received request to create Lesson Group Result {}", lessonGroupId);
        Long userId = jwtUtil.getUserId(accessToken);
        Long lessonGroupResultId = lessonService.createLessonGroupResult(userId, lessonGroupId);
        return ResponseEntity.created(URI.create("/learn/lesson-group-result")).body(new CreateLessonGroupResultResponseDTO(lessonGroupResultId));
    }

    /**
     * 유저별 레슨 결과 조회
     */
    @GetMapping("lesson/user/{lessonId}")
    public ResponseEntity<LessonResultByUserResponseDTO> findUserLessonResult(@RequestHeader("Authorization") String accessToken,
                                                                              @PathVariable("lessonId") Long lessonId) throws UnAuthorizedException {
        log.info("received request to find user lesson result {}", lessonId);
        Long userId = jwtUtil.getUserId(accessToken);
        Boolean isAccessed = false;
        Optional<LessonInfoDTO> lessonInfo = lessonService.getLessonInfoForUser(userId, lessonId);
        if(lessonInfo.isPresent()) isAccessed = true;
        return ResponseEntity.ok(new LessonResultByUserResponseDTO(isAccessed, lessonInfo.orElse(null)));
    }

    /**
     * 개별 레슨 저장
     */
    @PostMapping("lesson")
    public ResponseEntity<LessonMsgResponseDTO> saveLessonResult(@RequestHeader("Authorization") String accessToken,
                                                                 @RequestBody LessonSaveRequestDTO request) throws UnAuthorizedException {

        log.info("received request to save lesson result {}", request.getLessonId());
        Long userId = jwtUtil.getUserId(accessToken);
        Long savelessonId = lessonService.saveLesson(request);
        return ResponseEntity.created(URI.create("/learn/lesson")).body(new LessonMsgResponseDTO("ok"));
    }

    /**
     * 레슨 그룹 결과 저장(레슨 다 학습한 뒤)
     * 이름이 저장이라서 헷갈리는데, 프론트에서 보냈던 레슨 저장 정보를 바탕으로 결과를 종합해서 리턴
     */
    @PutMapping("lesson-group-result/{lessonGroupResultId}")
    public ResponseEntity<LessonGroupResultSaveResponseDTO> saveLessonGroupResult(@RequestHeader("Authorization") String accessToken,
                                                   @PathVariable("lessonGroupResultId") Long lessonGroupResultId) throws UnAuthorizedException {
        log.info("received request to save lesson group result for {}", lessonGroupResultId);
        Long userId = jwtUtil.getUserId(accessToken);
        LessonGroupResultSaveResponseDTO result = lessonService.saveLessonGroupResult(userId, lessonGroupResultId);
        return ResponseEntity.ok(result);
    }

    /**
     * 레슨 신고
     */
    @PostMapping("/lesson/claim")
    public ResponseEntity<LessonMsgResponseDTO> claimLesson(@RequestHeader("Authorization") String accessToken,
                                                            @RequestBody LessonClaimRequestDTO request) throws UnAuthorizedException {
        log.info("received request to claim lesson {}", request.getLessonId());
        Long userId = jwtUtil.getUserId(accessToken);
        Long lessonClaimId = lessonService.saveClaim(userId, request.getLessonId(), request.getContent());
        return ResponseEntity.created(URI.create("/learn/lesson/claim")).body(new LessonMsgResponseDTO("ok"));
    }
}
