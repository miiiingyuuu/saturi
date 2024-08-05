package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonClaimEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.dto.admin.AdminMsgResponseDTO;
import com.tunapearl.saturi.dto.admin.lesson.*;
import com.tunapearl.saturi.dto.lesson.LessonClaimResponseDTO;
import com.tunapearl.saturi.service.lesson.AdminLessonService;
import com.tunapearl.saturi.service.lesson.GcsService;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.LocationService;
import com.tunapearl.saturi.utils.FileStoreUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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
    private final FileStoreUtil fileStoreUtil;
    private final GcsService gcsService;

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
     * 레슨 그룹 조회
     */
    @GetMapping("/lesson-group")
    public ResponseEntity<List<LessonGroupResponseDTO>> getLessonGroup() {
        log.info("received request to find All lesson groups");

        List<LessonGroupEntity> allLessonGroup = lessonService.findAllLessonGroup();
        List<LessonGroupResponseDTO> result = allLessonGroup.stream()
                .map(g -> new LessonGroupResponseDTO(g)).toList();

        return ResponseEntity.ok(result);
    }

    /**
     * 레슨 등록(file 등록이 필요하여 form으로 전송해야함  enctype="multipart/form-data"
     */
    @PostMapping
    public ResponseEntity<AdminMsgResponseDTO> registerLesson(@ModelAttribute LessonRegisterRequestDTO request) throws IOException {
        log.info("received request to register lesson {}", request);
        LessonGroupEntity findLessonGroup = lessonService.findByIdLessonGroup(request.getLessonGroupId());
        UploadFile attachFile = fileStoreUtil.storeFile(request.getSampleVoice());
        /**
         * 임시로 파일을 생성해서 그걸 올리는데, 그걸 찾을 수 없다는 오류가 발생함
         * 그래서 그 방식을 그대로 구현함(내가 파일 로컬 폴더에 저장하고 그걸 올리고 파일 삭제)
         */
//        gcsService.uploadFile("saturi", request.getSampleVoice().getOriginalFilename(), request.getSampleVoice());
        String filePath = attachFile.getStoreFileName();
        Long lessonId = adminLessonService.createLesson(findLessonGroup, request.getScript(), filePath, attachFile.getStoreFileName());
        return ResponseEntity.created(URI.create("/lesson")).body(new AdminMsgResponseDTO("ok"));
    }

    /**
     * 레슨 전체 조회
     */
    @GetMapping
    public ResponseEntity<List<LessonResponseDTO>> getAllLesson(@ModelAttribute LessonSearch request) {
        log.info("received request to find All lessons");
        List<LessonEntity> lessons = adminLessonService.findByLocationAndLessonCategory(request.getLessonGroupId(), request.getLocationId(), request.getLessonCategoryId());
        List<LessonResponseDTO> allLessonDTO = new ArrayList<>();
        lessons.forEach((lesson) -> allLessonDTO.add(new LessonResponseDTO(
                lesson.getLessonId(), lesson.getLessonGroup().getLessonGroupId(),
                lesson.getLessonGroup().getName(), lesson.getSampleVoicePath(), lesson.getSampleVoiceName(),
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
                findLesson.getSampleVoicePath(), findLesson.getSampleVoiceName(), findLesson.getScript(), findLesson.getLastUpdateDt()));
    }

    /**
     * 레슨 수정
     */
    @PutMapping("/{lessonId}")
    public ResponseEntity<AdminMsgResponseDTO> updateLesson(@PathVariable Long lessonId,
                                                            @ModelAttribute LessonRegisterRequestDTO request) throws IOException {
        log.info("received request to update lesson {}", lessonId);
        LessonGroupEntity findLessonGroup = lessonService.findByIdLessonGroup(request.getLessonGroupId());
        UploadFile attachFile = fileStoreUtil.storeFile(request.getSampleVoice());
        String filePath = attachFile.getStoreFileName();

        lessonService.updateLesson(lessonId, request.getLessonGroupId(), request.getScript(), filePath);
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

    /**
     * 레슨 신고 조회
     */
    @GetMapping("claim")
    public ResponseEntity<List<LessonClaimResponseDTO>> getLessonClaims() {
        log.info("received request to get claims");
        List<LessonClaimEntity> lessonClaims = lessonService.findAllLessonClaim();
        List<LessonClaimResponseDTO> lessonClaimDTOs = new ArrayList<>();
        for (LessonClaimEntity lessonClaim : lessonClaims) {
            LessonClaimResponseDTO claimDTO = new LessonClaimResponseDTO(lessonClaim.getLessonClaimId(), lessonClaim.getLesson().getLessonId(),
                    lessonClaim.getUser().getUserId(), lessonClaim.getContent(), lessonClaim.getClaimDt());
            lessonClaimDTOs.add(claimDTO);
        }
        return ResponseEntity.ok(lessonClaimDTOs);
    }
}
























