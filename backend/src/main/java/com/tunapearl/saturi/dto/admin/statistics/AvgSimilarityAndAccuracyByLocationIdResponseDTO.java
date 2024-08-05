package com.tunapearl.saturi.dto.admin.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AvgSimilarityAndAccuracyByLocationIdResponseDTO {
    private Long locationId;
    private Long avgSimilarity;
    private Long avgAccuracy;
}
