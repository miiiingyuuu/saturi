package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.dto.admin.AdminMsgResponseDTO;
import com.tunapearl.saturi.dto.admin.LessonGroupRegisterRequestDTO;
import com.tunapearl.saturi.dto.admin.LessonGroupResponseDTO;
import com.tunapearl.saturi.dto.admin.LessonRegisterRequestDTO;
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

        allLessonGroup.forEach(lessonGroup -> allLessonGroupDTO.add(new LessonGroupResponseDTO(lessonGroup.getLessonGroupId(), lessonGroup.getLocation().getName(),
                lessonGroup.getLessonCategory().getName(), lessonGroup.getName())));

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

}
























