package com.tunapearl.saturi.dto.lesson;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.hibernate.validator.constraints.Range;

@Getter
@AllArgsConstructor
public class LocationIdAndCategoryIdDTO {
    @Range(min = 2, max = 7)
    private Long locationId;

    @Range(min = 1, max = 4)
    private Long categoryId;
}
