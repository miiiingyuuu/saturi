package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.lesson.*;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.statistics.*;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.AdminService;
import com.tunapearl.saturi.service.user.LocationService;
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

    @GetMapping("/user-location")
    public ResponseEntity<UserLocationResponseDTO> getUserLocation() {
        log.info("received request to get user-location statistics");
        return ResponseEntity.ok(adminService.getUserLocationStatistics());
    }

    @GetMapping("/avg-similarity")
    public ResponseEntity<List<AvgSimilarityAndAccuracyByLocationIdResponseDTO>> getAvgSimilarity() {
        log.info("received request to get avg similarity and accuracy statistics");
        return ResponseEntity.ok(adminService.getAvgSimilarityStatistics());
    }

    @GetMapping("/lesson")
    public ResponseEntity<LessonStatisticsResponseDTO> getLessonStatistics() {
        log.info("received request to get lesson statistics");
        return ResponseEntity.ok(adminService.getLessonStatistics());
    }

    @GetMapping("/content")
    public ResponseEntity<LessonAndGameRateResponseDTO> getContentRatioStatistics() {
        log.info("received request to get content ratio statistics");
        return ResponseEntity.ok(adminService.getContentRatioStatistic());
    }
}
