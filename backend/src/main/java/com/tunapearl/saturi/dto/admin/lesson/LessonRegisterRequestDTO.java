package com.tunapearl.saturi.dto.admin.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class LessonRegisterRequestDTO {
    private Long lessonGroupId; // 어떤 퍼즐
    private String script;
//    private File sampleVoice; // FIXME 원본 음성 파일 등록
}
