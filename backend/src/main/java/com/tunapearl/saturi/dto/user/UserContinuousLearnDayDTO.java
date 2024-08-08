package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UserContinuousLearnDayDTO {
    private Long learnDays;
    private List<Integer> daysOfTheWeek;
    private List<Integer> weekAndMonth;

    public UserContinuousLearnDayDTO() {

    }
}
