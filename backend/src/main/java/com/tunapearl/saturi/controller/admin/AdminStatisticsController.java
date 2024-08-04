package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.lesson.LessonResponseDTO;
import com.tunapearl.saturi.dto.admin.statistics.AvgSimilarityAndAccuracyByLocationIdResponseDTO;
import com.tunapearl.saturi.dto.admin.statistics.LocationIdAndUserNumDTO;
import com.tunapearl.saturi.dto.admin.statistics.UserLocationResponseDTO;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.AdminService;
import com.tunapearl.saturi.service.user.LocationService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/statistics")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminStatisticsController {

    private final AdminService adminService;
    private final LocationService locationService;

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
            // 지역 아이디로 레슨 그룹 조회
            List<LessonGroupEntity> lessonGroups = adminService.findLessonGroupByLocationId(location.getLocationId());
            Long similaritySum = 0L;
            Long accuracySum = 0L;
            int divided = 0;
            // 레슨 그룹 아이디로 레슨 그룹 결과 조회
            for (LessonGroupEntity lessonGroup : lessonGroups) {
                List<LessonGroupResultEntity> lessonGroupResults = adminService.findLessonGroupResultByLessonGroupId(lessonGroup.getLessonGroupId());
                int lessonGroupResultSize = lessonGroupResults.size();
                for (LessonGroupResultEntity lgr : lessonGroupResults) {
                    similaritySum += lgr.getAvgSimilarity();
                    accuracySum += lgr.getAvgAccuracy();
                }
                divided += lessonGroupResultSize;
            }
            result.add(new AvgSimilarityAndAccuracyByLocationIdResponseDTO(location.getLocationId(), similaritySum/divided, accuracySum/divided));
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/lesson")
    public ResponseEntity<LessonResponseDTO> getLessonStatistics() {
        log.info("received request to get lesson statistics");
        // TODO 레슨별 완료횟수, 평균 유사도, 평균 정확도, 신고횟수 조회
        return ResponseEntity.ok(null);
    }
}
