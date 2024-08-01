package com.tunapearl.saturi.dto.admin.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@AllArgsConstructor
public class LessonRegisterRequestDTO {
    private Long lessonGroupId; // 어떤 퍼즐
    private String script;
    private MultipartFile sampleVoice;
}
