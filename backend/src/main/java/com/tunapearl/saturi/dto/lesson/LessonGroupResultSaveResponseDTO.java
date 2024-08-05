package com.tunapearl.saturi.dto.lesson;

import com.tunapearl.saturi.dto.user.UserInfoCurExpAndEarnExp;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class LessonGroupResultSaveResponseDTO {
    private UserInfoCurExpAndEarnExp userInfo;
    private List<LessonResultForSaveGroupResultDTO> lessonResult;
    private LessonGroupResultForSaveLessonGroupDTO lessonGroupResult;
}
