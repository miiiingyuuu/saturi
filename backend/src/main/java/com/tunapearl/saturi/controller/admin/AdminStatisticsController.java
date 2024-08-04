package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.admin.lesson.LessonResponseDTO;
import com.tunapearl.saturi.dto.admin.statistics.AvgSimilarityAndAccuracyByLocationIdResponseDTO;
import com.tunapearl.saturi.dto.admin.statistics.UserLocationResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/statistics")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminStatisticsController {

    @GetMapping("/user-location")
    public ResponseEntity<UserLocationResponseDTO> getUserLocation() {
        log.info("received request to get user-location statistics");
        // TODO 출신 지역별 사용자 현황 조회
        return ResponseEntity.ok(null);
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
