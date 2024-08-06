package com.tunapearl.saturi.dto.lesson;

import com.tunapearl.saturi.dto.user.UserExpInfoCurExpAndEarnExp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
public class LessonGroupResultSaveResponseDTO {
    private UserExpInfoCurExpAndEarnExp userInfo;
    private List<LessonResultForSaveGroupResultDTO> lessonResult;
    private LessonGroupResultForSaveLessonGroupDTO lessonGroupResult;
}
