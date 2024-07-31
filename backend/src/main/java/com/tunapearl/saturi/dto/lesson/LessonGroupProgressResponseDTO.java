package com.tunapearl.saturi.dto.lesson;

import com.tunapearl.saturi.dto.user.UserExpAndRankDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class LessonGroupProgressResponseDTO {
    private Long progress;
    private List<LessonGroupProgressByUserDTO> lessonGroup;
    private UserExpAndRankDTO userInfo;
}
