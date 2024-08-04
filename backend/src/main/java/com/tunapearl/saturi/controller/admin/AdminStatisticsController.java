package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
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
        Long[] userNums = new Long[locationNum + 1]; // not zero index
        List<UserEntity> users = adminService.getAllUsersSortedByExp(); //FIXME admin 제외한걸로
        for (UserEntity user : users) {
            userNums[user.getLocation().getLocationId().intValue()]++;
        }
        List<LocationIdAndUserNumDTO> absoluteValue = new ArrayList<>();
        for(int i = 1; i < locationNum + 1; i++) {
            LocationIdAndUserNumDTO locationIdAndUserNum = new LocationIdAndUserNumDTO((long)i, userNums[i]);
            absoluteValue.add(locationIdAndUserNum);
        }

        List<LocationIdAndUserNumDTO> relativeValue = new ArrayList<>();
        int userNum = users.size();
        for(int i = 1; i < locationNum + 1; i++) {
            LocationIdAndUserNumDTO locationIdAndUserNum = new LocationIdAndUserNumDTO((long)i, userNums[i] * 100 / userNum);
            relativeValue.add(locationIdAndUserNum);
        }

        return ResponseEntity.ok(new UserLocationResponseDTO(relativeValue, absoluteValue));
    }

    @GetMapping("/avg-similarity")
    public ResponseEntity<List<AvgSimilarityAndAccuracyByLocationIdResponseDTO>> getAvgSimilarity() {
        log.info("received request to get avg similarity and accuracy statistics");
        // TODO 지역별 평균 유사도/정확도 조회
        return ResponseEntity.ok(null);
    }

    @GetMapping("/lesson")
    public ResponseEntity<LessonResponseDTO> getLessonStatistics() {
        log.info("received request to get lesson statistics");
        // TODO 레슨별 완료횟수, 평균 유사도, 평균 정확도, 신고횟수 조회
        return ResponseEntity.ok(null);
    }
}
