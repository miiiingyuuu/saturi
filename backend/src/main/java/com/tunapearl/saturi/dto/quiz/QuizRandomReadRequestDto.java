package com.tunapearl.saturi.dto.quiz;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizRandomReadRequestDto {
    @Positive @NotNull
    private Long roomId;
    @Positive @NotNull
    private Long locationId;
}
