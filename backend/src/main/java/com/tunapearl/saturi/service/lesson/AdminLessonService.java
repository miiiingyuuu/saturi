package com.tunapearl.saturi.service.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.dto.lesson.SaveLessonGraphResponseDTO;
import com.tunapearl.saturi.exception.AlreadyMaxSizeException;
import com.tunapearl.saturi.repository.lesson.AdminLessonRepository;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminLessonService {

    private final AdminLessonRepository adminLessonRepository;
    private final LessonService lessonService;
    private final LessonRepository lessonRepository;

    @Transactional
    public LessonCategoryEntity createLessonCategory(String name) {
        LessonCategoryEntity lessonCategory = new LessonCategoryEntity();
        lessonCategory.setName(name);
        Long findLessonCategoryId = adminLessonRepository.saveLessonCategory(lessonCategory);
        return lessonCategory;
    }

    @Transactional
    public Long createLessonGroup(LocationEntity location, LessonCategoryEntity lessonCategory, String name) {
        List<LessonGroupEntity> lessonGroups = lessonService.findLessonGroupByLocationAndCategory(location.getLocationId(), lessonCategory.getLessonCategoryId());
        if(lessonGroups != null && lessonGroups.size() >= 9) {
            throw new AlreadyMaxSizeException();
        }
        LessonGroupEntity lessonGroup = new LessonGroupEntity();
        lessonGroup.setLocation(location);
        lessonGroup.setLessonCategory(lessonCategory);
        lessonGroup.setName(name);
        return adminLessonRepository.saveLessonGroup(lessonGroup);
    }

    @Transactional
    public Long createLesson(LessonGroupEntity lessonGroup, String script, String fileName) {
        List<LessonEntity> lessons = lessonService.findAllByLessonGroupId(lessonGroup.getLessonGroupId());
        if(lessons != null && lessons.size() >= 5) {
            throw new AlreadyMaxSizeException();
        }
        String fitch = getFileGraph(fileName);

        LessonEntity lesson = new LessonEntity();
        lesson.setLessonGroup(lessonGroup);
        lesson.setScript(script);
        lesson.setSampleVoicePath("no path");
        lesson.setSampleVoiceName(fileName);
        lesson.setGraphY(fitch);
        lesson.setLastUpdateDt(LocalDateTime.now());
        return adminLessonRepository.saveLesson(lesson);
    }

    private static String getFileGraph(String fileName) {
        // 정답 음성 파형 저장을 위한 http 통신(RestTemplate, WebClient 중 전자 선택 -> 간단한 요청이라서)
        RestTemplate restTemplate = new RestTemplate();

        // json data
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("answerVoiceFileName", fileName);
        requestBody.put("UserVoiceFileName", fileName); // 장고의 api가 이렇게 두개의 파일이름을 보내는 것 뿐이라 똑같은 파일이름을 보냄

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 엔티티 생성
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // REST API 호출
        String url = "https://i11d104.p.ssafy.io/saturi-ai/audio/analyze/";
        ResponseEntity<SaveLessonGraphResponseDTO> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, SaveLessonGraphResponseDTO.class);

        // 응답 처리
        if(response.getStatusCode().is2xxSuccessful()) {
            List<Double> voicePitch = response.getBody().getAnswerVoicePitch();
            if(voicePitch == null) throw new RuntimeException("파형 정보를 불러올 수 없습니다");
            return voicePitch.toString();
        } else {
            throw new IllegalArgumentException("파일 저장에 문제가 발생하였습니다");
        }
    }

    public void updateLesson(Long lessonId, Long lessonGroupId, String script, String storeFileName) {
        List<LessonEntity> allByLessonGroupId = lessonService.findAllByLessonGroupId(lessonGroupId);
        if(allByLessonGroupId.size() >= 5) {
            throw new AlreadyMaxSizeException();
        }
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);
        LessonGroupEntity findLessonGroup = lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);
        lesson.setLessonGroup(findLessonGroup);
        lesson.setScript(script);

        if(storeFileName != null) {
            String voicePitch = getFileGraph(storeFileName);
            lesson.setSampleVoicePath(storeFileName);
            lesson.setGraphY(voicePitch);
        }
        lesson.setLastUpdateDt(LocalDateTime.now());
    }

    public void deleteLesson(Long lessonId) {
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);
        findLesson.setLessonGroup(null);
        findLesson.setIsDeleted(true);
        findLesson.setLastUpdateDt(LocalDateTime.now());
    }

    public List<LessonEntity> findAll() {
        return adminLessonRepository.findAll().orElse(null);
    }

    public List<LessonEntity> findByLocationAndLessonCategory(Long lessonGroupId, Long locationId, Long lessonCategoryId) {
        return adminLessonRepository.findByLocationAndLessonCategory(lessonGroupId, locationId, lessonCategoryId).orElse(null);
    }

    public LessonEntity findById(Long lessonId) {
        LessonEntity findLesson = adminLessonRepository.findById(lessonId).orElse(null);
        if(findLesson == null) throw new IllegalArgumentException("존재하지 않는 레슨입니다.");
        return findLesson;
    }
}
