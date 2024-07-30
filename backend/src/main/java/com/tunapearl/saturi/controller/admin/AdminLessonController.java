package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.dto.admin.AdminMsgResponseDTO;
import com.tunapearl.saturi.dto.admin.lesson.*;
import com.tunapearl.saturi.service.lesson.AdminLessonService;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.LocationService;
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
@RequestMapping("/admin/lesson")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminLessonController {

    private final AdminLessonService adminLessonService;
    private final LocationService locationService;
    private final LessonService lessonService;

    /**
     * lesson group 등록
     */
    @PostMapping("/lesson-group")
    public ResponseEntity<AdminMsgResponseDTO> registerLessonGroup(
            @RequestBody LessonGroupRegisterRequestDTO request) {
        log.info("received request to register a new lesson group for {}", request);
        LocationEntity findLocation = locationService.findById(request.getLocationId());
        LessonCategoryEntity findLessonCategory = lessonService.findByIdLessonCategory(request.getLessonCategoryId());
        Long lessonGroupId = adminLessonService.createLessonGroup(findLocation, findLessonCategory, request.getName());
        return ResponseEntity.created(URI.create("/lesson-group")).body(new AdminMsgResponseDTO("ok"));
    }

    /**
     * 퍼즐 목록 반환
     */
    //FIXME 덜 완성된 퍼즐만 반환하도록(관리자가 문제 등록할 때, 퍼즐 선택하는 드롭박스에 들어갈 애들)
    @GetMapping("/lesson-group")
    public ResponseEntity<List<LessonGroupResponseDTO>> getLessonGroup() {
        log.info("received request to find All lesson groups");

        List<LessonGroupEntity> allLessonGroup = lessonService.findAllLessonGroup();
        List<LessonGroupResponseDTO> allLessonGroupDTO = new ArrayList<>();

        allLessonGroup.forEach(lessonGroup -> allLessonGroupDTO.add(new LessonGroupResponseDTO(lessonGroup.getLessonGroupId(),
                lessonGroup.getLocation().getName(), lessonGroup.getLessonCategory().getName(), lessonGroup.getName())));

        return ResponseEntity.ok(allLessonGroupDTO);
    }

    /**
     * 레슨 등록
     */
    //FIXME 파일 등록 추가
    @PostMapping
    public ResponseEntity<AdminMsgResponseDTO> registerLesson(@RequestBody LessonRegisterRequestDTO request) {
        log.info("received request to register lesson {}", request);
        LessonGroupEntity findLessonGroup = lessonService.findByIdLessonGroup(request.getLessonGroupId());
        Long lessonId = adminLessonService.createLesson(findLessonGroup, request.getScript());
        return ResponseEntity.created(URI.create("/lesson")).body(new AdminMsgResponseDTO("ok"));
    }

    /**
     * 레슨 전체 조회
     */
    @GetMapping
    public ResponseEntity<List<LessonResponseDTO>> getAllLesson(@RequestParam("locationId") Long locationId,
                                                                @RequestParam("lessonCategoryId") Long lessonCategoryId) {
        log.info("received request to find All lessons");
        List<LessonEntity> lessons = adminLessonService.findByLocationAndLessonCategory(locationId, lessonCategoryId);
        List<LessonResponseDTO> allLessonDTO = new ArrayList<>();
        lessons.forEach((lesson) -> allLessonDTO.add(new LessonResponseDTO(
                lesson.getLessonId(), lesson.getLessonGroup().getLessonGroupId(),
                lesson.getLessonGroup().getName(), lesson.getSampleVoicePath(),
                lesson.getScript(), lesson.getLastUpdateDt())));
        return ResponseEntity.ok(allLessonDTO);
    }

    /**
     * 레슨 개별 조회
     */
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDTO> getLesson(@PathVariable Long lessonId) {
        log.info("received request to find Lesson {}", lessonId);
        LessonEntity findLesson = adminLessonService.findById(lessonId);
        return ResponseEntity.ok(new LessonResponseDTO(findLesson.getLessonId(),
                findLesson.getLessonGroup().getLessonGroupId(), findLesson.getLessonGroup().getName(),
                findLesson.getSampleVoicePath(), findLesson.getScript(), findLesson.getLastUpdateDt()));
    }

    /**
     * 레슨 수정
     */
    @PutMapping("/{lessonId}")
    public ResponseEntity<AdminMsgResponseDTO> updateLesson(@PathVariable Long lessonId,
                                                            @RequestBody LessonUpdateRequestDTO request) {
        log.info("received request to update lesson {}", lessonId);
        lessonService.updateLesson(lessonId, request.getLessonGroupId(), request.getScript());
        return ResponseEntity.ok(new AdminMsgResponseDTO("ok"));
    }

    /**
     * 레슨 삭제
     */
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<AdminMsgResponseDTO> deleteLesson(@PathVariable Long lessonId) {
        log.info("received request to delete lesson {}", lessonId);
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.ok(new AdminMsgResponseDTO("ok"));
    }
}
























