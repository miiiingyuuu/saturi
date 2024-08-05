package com.tunapearl.saturi.dto.admin.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class LessonStatisticsResponseDTO {
    private List<LessonIdAndValueDTO> sortedByCompletedNum;
    private List<LessonIdAndValueDTO> sortedByAvgSimilarity;
    private List<LessonIdAndValueDTO> sortedByAvgAccuracy;
    private List<LessonIdAndValueDTO> sortedByClaimNum;
}
