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
    private String answerVoicePitch;
    private String userVoicePitch;
    private String userVoiceTime;
    private String userScript;
}
