package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class userContinuousLearnDayDTO {
    private Long learnDays;
    private List<Long> daysOfTheWeek;
}
