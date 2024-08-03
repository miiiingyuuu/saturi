package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserStreakInfoDaysDTO {
    private UserStreakDateDTO streakDate;
    private Integer solvedNum;
}
