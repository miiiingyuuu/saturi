package com.tunapearl.saturi.dto.game;

import lombok.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@Data
public class GameQuizResponseDTO {

    private Long quizId;
    private String question;
    private Boolean isObjective;
    private List<GameQuizChoiceDTO> quizChoiceList = new ArrayList<>();
    private Long sequence;

    // 기본 생성자
    public GameQuizResponseDTO() {
    }

    // 필드를 초기화하는 생성자
    public GameQuizResponseDTO(Long quizId, String question, Boolean isObjective, GameQuizChoiceDTO... quizChoiceList) {
        this.quizId = quizId;
        this.question = question;
        this.isObjective = isObjective;
        this.quizChoiceList.addAll(Arrays.asList(quizChoiceList));
    }
}
