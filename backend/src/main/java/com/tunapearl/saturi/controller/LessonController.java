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
        log.info("received request to get lesson group id by location and category {}, {}", request.getLocationId(), request.getCategoryId());
        List<LessonGroupEntity> lessonGroupByLocationAndCategory = lessonService.findLessonGroupByLocationAndCategory(request.getLocationId(), request.getCategoryId());
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
                findLesson.getSampleVoicePath(), findLesson.getSampleVoiceName(), findLesson.getScript(), findLesson.getLastUpdateDt()));
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
     * 레슨 저장
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
        //FIXME 다 만들고나서 비즈니스 로직 서비스로 옮기고 반환 데이터만 받아오기(DTO끼리 연관돼있어서 일단 컨트롤러에서 만들어보고)
        Long userId = jwtUtil.getUserId(accessToken);
        // leesonGroupResult 조회
        LessonGroupResultEntity lessonGroupResult = lessonService.findLessonGroupResult(lessonGroupResultId);
        LocalDateTime lessonResultStartDt = lessonGroupResult.getStartDt();

        // 최근순으로 정렬된 레슨 결과 조회(건너뛰기 포함)
        List<LessonResultEntity> lessonResults = lessonService.findLessonResultByLessonGroupResultIdSortedByRecentDt(lessonGroupResultId);

        List<LessonResultForSaveGroupResultDTO> LessonResultForSaveGroupResults = new ArrayList<>(); // DTO

        Map<Long, LessonResultEntity> lessonResultMap = new HashMap<>(); // 이번에 한 결과
        Map<Long, Long> expMap = new HashMap<>(); // 줘야하는 경험치
        Map<Long, Long> lessonAccentSimilarityMap = new HashMap<>(); // 억양 유사도
        Map<Long, Long> lessonPronunciationAccuracyMap = new HashMap<>(); // 발음 정확도
        PriorityQueue<LessonResultEntity> lessonResultPQ = new PriorityQueue<>(new Comparator<LessonResultEntity>() {
            @Override
            public int compare(LessonResultEntity o1, LessonResultEntity o2) {
                Long o1Score = (o1.getAccentSimilarity() + o1.getPronunciationAccuracy()) / 2;
                Long o2Score = (o2.getAccentSimilarity() + o2.getPronunciationAccuracy()) / 2;
                return Long.compare(o2Score, o1Score);
            }
        });

        for (LessonResultEntity lr : lessonResults) {

            LocalDateTime lessonDt = lr.getLessonDt();
            Long lessonId = lr.getLesson().getLessonId();

            if(lessonResultStartDt.isBefore(lessonDt)) { // 이번에 한 레슨이면
                // 일단 처음했다치고 맵에다가 레슨결과를 담고, 경험치도 20exp로 담는다. score도 담는다.
                    // 근데 건너뛰기 했으면 경험치는 0으로, score도 0으로
                if(lr.getIsSkipped()) { // 건너뛰기
                    lessonResultMap.put(lessonId, lr);
                    expMap.put(lessonId, 0L);
                    lessonAccentSimilarityMap.put(lessonId, 0L);
                    lessonPronunciationAccuracyMap.put(lessonId, 0L);
                } else {
                    lessonResultMap.put(lessonId, lr);
                    expMap.put(lessonId, 20L);
                    lessonAccentSimilarityMap.put(lessonId, lr.getAccentSimilarity());
                    lessonPronunciationAccuracyMap.put(lessonId, lr.getPronunciationAccuracy());
                }
            } else { // 이번에 한게 아니면
                if(lessonResultMap.containsKey(lessonId)) { // 맵에 레슨 아이디 키가 존재하면 이번에 한게 복습이라는거거나, 건너뛰기했다는 거거나
                    // 이전에 건너뛰기 한거였으면 continue
                    if(lr.getIsSkipped()) continue;

                    // 이전에 한게 더 잘했으면 경험치 0exp
                    // 이번에 한게 더 잘했으면 경험치 10exp
                    Long prevLessonScore = (lr.getAccentSimilarity() + lr.getPronunciationAccuracy()) / 2;
                    Long curLessonScore = (lessonResultMap.get(lessonId).getAccentSimilarity() +
                            lessonResultMap.get(lessonId).getPronunciationAccuracy()) / 2;

                    if(curLessonScore < prevLessonScore) { // 이전에 한게 더 잘했다.
                        expMap.replace(lessonId, 0L); // 경험치 0으로
                        // 수치 map을 높은 얘로 갱신
                        lessonAccentSimilarityMap.replace(lessonId, Math.max(lessonAccentSimilarityMap.get(lessonId), lr.getAccentSimilarity()));
                        lessonPronunciationAccuracyMap.replace(lessonId, Math.max(lessonPronunciationAccuracyMap.get(lessonId), lr.getPronunciationAccuracy()));
                    } else { // 이번에 한게 더 잘했다.
                        expMap.replace(lessonId, 10L); // 경험치 10으로
                        // 수치 map을 높은 애로 갱신
                        lessonAccentSimilarityMap.replace(lessonId, Math.max(lessonAccentSimilarityMap.get(lessonId), lessonResultMap.get(lessonId).getAccentSimilarity()));
                        lessonPronunciationAccuracyMap.replace(lessonId, Math.max(lessonPronunciationAccuracyMap.get(lessonId), lessonResultMap.get(lessonId).getPronunciationAccuracy()));
                    }

                } else { // 맵에 레슨 아이디 키가 없으면 이전에 풀었던거 이번에 스킵한거임
                    // 그러면 DTO에 isBeforeResult인지 알려줘야하고(맵에서 채울 때 lessonDt랑 lessonGroupResult의 startDt 비교해서 해야할듯)
                    // 맵에 이미 했던 결과를 넣어줘야함(근데 냅다 넣으면 다음에 이미 학습한 똑같은 레슨아이디가 돌 때, 이번에 한거라고 될 수 있어서 pq에 담아야할듯?
                    // 제일 잘한 결과를 보여줘야 하기 때문에 pq에 담아서, map 사이즈가 5가 될 때까지 넣기, 똑같은 레슨아이디인 애들이 젤 위에 있으면 이미 들어가있는지 확인해서 거르기
                    lessonResultPQ.offer(lr);
                }
            }
        } // end for
        // lessonGroupResult 갱신
            // 수치 갱신
            // 완료여부 갱신


        // DTO 생성
//        LessonResultForSaveGroupResults.add(new LessonResultForSaveGroupResultDTO()); // map에서 채우기

        return ResponseEntity.ok(new LessonGroupResultSaveResponseDTO());
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
