package com.tunapearl.saturi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.io.File;

@Getter
@AllArgsConstructor
@ToString
public class LessonRegisterRequestDTO {
    private Long lessonGroupId; // 어떤 퍼즐
    private String script;
//    private File sampleVoice; // FIXME 원본 음성 파일 등록
}
