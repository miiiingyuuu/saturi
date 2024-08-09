package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class SaveLessonGraphResponseDTO {
    private int voiceSimilarity;
    private int scriptSimilarity;
    private List<Double> answerVoicePitch;
    private List<Double> userVoicePitch;
    private List<Double> userVoiceTime;
    private String userScript;
}
