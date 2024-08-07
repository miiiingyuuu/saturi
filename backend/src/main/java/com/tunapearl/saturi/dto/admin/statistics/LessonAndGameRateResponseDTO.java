package com.tunapearl.saturi.dto.admin.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.bind.annotation.GetMapping;

@Getter
@AllArgsConstructor
public class LessonAndGameRateResponseDTO {
    private Long lessonRate;
    private Long gameRate;
}
