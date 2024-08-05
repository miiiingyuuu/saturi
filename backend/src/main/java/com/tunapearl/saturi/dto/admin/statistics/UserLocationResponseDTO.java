package com.tunapearl.saturi.dto.admin.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UserLocationResponseDTO {
    private List<LocationIdAndUserNumDTO> relativeValue;
    private List<LocationIdAndUserNumDTO> absoluteValue;
}
