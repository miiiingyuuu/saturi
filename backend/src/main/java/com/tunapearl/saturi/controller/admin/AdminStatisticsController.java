package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.lesson.*;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.lesson.LessonResponseDTO;
import com.tunapearl.saturi.dto.admin.statistics.*;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.AdminService;
import com.tunapearl.saturi.service.user.LocationService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/statistics")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminStatisticsController {

    private final AdminService adminService;
    private final LocationService locationService;
    private final LessonService lessonService;

    @GetMapping("/user-location")
    public ResponseEntity<UserLocationResponseDTO> getUserLocation() {
        log.info("received request to get user-location statistics");
        List<LocationEntity> locations = locationService.findAll();
        int locationNum = locations.size();
        int[] userNums = new int[locationNum + 1]; // not zero index
        List<UserEntity> users = adminService.getAllUsersExceptAdmin();
        for (UserEntity user : users) {
            userNums[user.getLocation().getLocationId().intValue()]++;
        }
        List<LocationIdAndUserNumDTO> absoluteValue = new ArrayList<>();
        for(int i = 1; i < locationNum + 1; i++) {
            LocationIdAndUserNumDTO locationIdAndUserNum = new LocationIdAndUserNumDTO((long)i, (long)userNums[i]);
            absoluteValue.add(locationIdAndUserNum);
        }

        List<LocationIdAndUserNumDTO> relativeValue = new ArrayList<>();
        int userNum = users.size();
        for(int i = 1; i < locationNum + 1; i++) {
            LocationIdAndUserNumDTO locationIdAndUserNum = new LocationIdAndUserNumDTO((long)i, (long)userNums[i] * 100 / userNum);
            relativeValue.add(locationIdAndUserNum);
        }

        return ResponseEntity.ok(new UserLocationResponseDTO(relativeValue, absoluteValue));
    }

    @GetMapping("/avg-similarity")
    public ResponseEntity<List<AvgSimilarityAndAccuracyByLocationIdResponseDTO>> getAvgSimilarity() {
        log.info("received request to get avg similarity and accuracy statistics");
        List<AvgSimilarityAndAccuracyByLocationIdResponseDTO> result = new ArrayList<>();

        List<LocationEntity> locations = locationService.findAll();
        for (LocationEntity location : locations) {
            if(location.getLocationId() == 1) continue;
            // 지역 아이디로 레슨 그룹 조회
            List<LessonGroupEntity> lessonGroups = adminService.findLessonGroupByLocationId(location.getLocationId());
            if(lessonGroups == null) {
                result.add(new AvgSimilarityAndAccuracyByLocationIdResponseDTO(location.getLocationId(), null, null));
                continue;
            }
            Long similaritySum = 0L;
            Long accuracySum = 0L;
            int divided = 0;
            // 레슨 그룹 아이디로 레슨 그룹 결과 조회

            // in 절 사용 위한 id List
            List<Long> lessonGroupIds = lessonGroups.stream()
                    .map(LessonGroupEntity::getLessonGroupId)
                    .toList();

            List<LessonGroupResultEntity> lessonGroupResults = adminService.findLessonGroupResultByLessonGroupId(lessonGroupIds);
            if(lessonGroupResults == null) continue;
            int lessonGroupResultSize = lessonGroupResults.size();
            for (LessonGroupResultEntity lgr : lessonGroupResults) {
                Long avgSimilarity = lgr.getAvgSimilarity();
                Long avgAccuracy = lgr.getAvgAccuracy();
                if(avgSimilarity == null || avgAccuracy == null) continue;
                similaritySum += avgSimilarity;
                accuracySum += avgAccuracy;
            }
            divided += lessonGroupResultSize;
            if(divided == 0) result.add(new AvgSimilarityAndAccuracyByLocationIdResponseDTO(location.getLocationId(), null, null));
            else result.add(new AvgSimilarityAndAccuracyByLocationIdResponseDTO(location.getLocationId(), similaritySum/divided, accuracySum/divided));
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/lesson")
    public ResponseEntity<LessonStatisticsResponseDTO> getLessonStatistics() {
        log.info("received request to get lesson statistics");
        List<LessonResultEntity> lessonResults = lessonService.findAllLessonResult();
        // 레슨별 완료 횟수
        List<LessonIdAndValueDTO> sortedByCompletedNum = new ArrayList<>();
        Map<Long, Long> lessonCompletedNumMap = new HashMap<>();
        for (LessonResultEntity lr : lessonResults) {
            Long lessonId = lr.getLesson().getLessonId();
            lessonCompletedNumMap.put(lessonId, lessonCompletedNumMap.getOrDefault(lessonId, 0L) + 1);
        }
        for (Long l : lessonCompletedNumMap.keySet()) {
            sortedByCompletedNum.add(new LessonIdAndValueDTO(l, lessonCompletedNumMap.get(l)));
        }
        sortedByCompletedNum.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
        if(sortedByCompletedNum.size() > 10) sortedByCompletedNum = sortedByCompletedNum.subList(0, 10);

        // 레슨별 평균 파형 유사도
        List<LessonIdAndValueDTO> sortedByAvgSimilarity = new ArrayList<>();
        Map<Long, Long> lessonSimilarityMap = new HashMap<>();
        for (LessonResultEntity lr : lessonResults) {
            Long lessonId = lr.getLesson().getLessonId();
            Long accentSimilarity = 0L;
            if(lr.getAccentSimilarity() != null) accentSimilarity = lr.getAccentSimilarity();
            lessonSimilarityMap.put(lessonId, lessonSimilarityMap.getOrDefault(lessonId, 0L) + accentSimilarity);
        }
        for (Long l : lessonSimilarityMap.keySet()) {
            sortedByAvgSimilarity.add(new LessonIdAndValueDTO(l, lessonSimilarityMap.get(l) / lessonCompletedNumMap.get(l)));
        }
        sortedByAvgSimilarity.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
        if(sortedByAvgSimilarity.size() > 10) sortedByAvgSimilarity = sortedByAvgSimilarity.subList(0, 10);

        // 레슨별 평균 발음 정확도
        List<LessonIdAndValueDTO> sortedByAvgAccuracy = new ArrayList<>();
        Map<Long, Long> lessonAccuracyMap = new HashMap<>();
        for (LessonResultEntity lr : lessonResults) {
            Long lessonId = lr.getLesson().getLessonId();
            Long pronunciationAccuracy = 0L;
            if(lr.getPronunciationAccuracy() != null) pronunciationAccuracy = lr.getPronunciationAccuracy();
            lessonAccuracyMap.put(lessonId, lessonAccuracyMap.getOrDefault(lessonId, 0L) + pronunciationAccuracy);
        }
        for (Long l : lessonAccuracyMap.keySet()) {
            sortedByAvgAccuracy.add(new LessonIdAndValueDTO(l, lessonAccuracyMap.get(l) / lessonCompletedNumMap.get(l)));
        }
        sortedByAvgAccuracy.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
        if(sortedByAvgAccuracy.size() > 10) sortedByAvgAccuracy = sortedByAvgSimilarity.subList(0, 10);

        // 레슨별 신고횟수
        List<LessonIdAndValueDTO> sortedByClaimNum = new ArrayList<>();
        List<LessonClaimEntity> lessonClaims = adminService.findAllLessonClaim();
        if(lessonClaims != null) {
            Map<Long, Long> lessonClaimMap = new HashMap<>();
            for (LessonClaimEntity lc : lessonClaims) {
                Long lessonId = lc.getLesson().getLessonId();
                lessonClaimMap.put(lessonId, lessonClaimMap.getOrDefault(lessonId, 0L) + 1);
            }
            for (Long l : lessonClaimMap.keySet()) {
                sortedByClaimNum.add(new LessonIdAndValueDTO(l, lessonClaimMap.get(l)));
            }
            sortedByClaimNum.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
            if(sortedByClaimNum.size() > 10) sortedByClaimNum = sortedByClaimNum.subList(0, 10);
        }


        return ResponseEntity.ok(new LessonStatisticsResponseDTO(sortedByCompletedNum, sortedByAvgSimilarity,
                sortedByAvgAccuracy, sortedByClaimNum));
    }

    @GetMapping("/content")
    public ResponseEntity<LessonAndGameRateResponseDTO> getContentStatistics() {
        // 레슨 그룹 결과 테이블 로우 개수
        List<LessonGroupResultEntity> lessonGroupResults = adminService.findAllLessonGroupResult();
        Long lessonRate = 0L;
        if(lessonGroupResults != null) {
            lessonRate = (long)lessonGroupResults.size();
        }

        // 게임방 테이블 로우 개수 * 5 (5명 참가)
        Long gameRate = 0L;
        List<GameRoomEntity> gameRooms = adminService.findAllGameRoom();
        if(gameRooms != null) {
            gameRate = gameRooms.size() * 5L;
        }
        Long total = lessonRate + gameRate;
        lessonRate = lessonRate * 100 / total;
        gameRate = gameRate * 100 / total;
        return ResponseEntity.ok(new LessonAndGameRateResponseDTO(lessonRate, gameRate));
    }
}
