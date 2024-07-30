package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.service.lesson.LessonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/learn")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LessonController {

    private final LessonService lessonService;

    /**
     * 모든 카테고리 조회
     */
    @GetMapping("/lesson-category")
    public ResponseEntity<List<LessonCategoryEntity>> getAllLessonCategory() {
        log.info("received request to get all lesson category");
        return ResponseEntity.ok(lessonService.findAllLessonCategory());
    }
    
    //TODO 지역, 유형을 받고 해당하는 퍼즐 반환
    /**
     * 퍼즐 조회(지역+유형)
     */
    @GetMapping("/lesson-group")
    public ResponseEntity<?> getLessonGroupIdByLocationAndCategory(@RequestParam Long locationId,
                                                                            @RequestParam Long categoryId) {
        log.info("received request to get lesson group id by location and category {}, {}", locationId, categoryId);
        return ResponseEntity.ok(lessonService.findLessonGroupByLocationAndCategory(locationId, categoryId));
    }

}
