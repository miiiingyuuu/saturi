package com.tunapearl.saturi.dto.admin.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.File;

@Getter
@AllArgsConstructor
public class LessonUpdateRequestDTO {
    private Long lessonGroupId;

    private String script;
    
//    private File sampleVoice; // FIXME 원본 음성 파일 등록
}
