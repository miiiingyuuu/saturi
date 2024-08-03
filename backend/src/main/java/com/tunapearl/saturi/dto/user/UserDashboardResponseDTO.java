package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UserDashboardResponseDTO {
    private UserExpInfoDTO userExpInfo;
    private UserRecentLessonGroupDTO recentLessonGroup;
    private UserContinuousLearnDayDTO continuousLearnDay;
    private List<UserStreakInfoDaysDTO> streakInfo;
    private UserTotalLessonInfoDTO totalLessonInfo;
}
