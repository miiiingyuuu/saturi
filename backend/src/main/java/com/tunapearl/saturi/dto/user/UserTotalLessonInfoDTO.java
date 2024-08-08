package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Objects;

@Getter
@AllArgsConstructor
public class UserTotalLessonInfoDTO {
    private int totalLessonGroup;
    private int totalLesson;

    public UserTotalLessonInfoDTO() {

    }
}
