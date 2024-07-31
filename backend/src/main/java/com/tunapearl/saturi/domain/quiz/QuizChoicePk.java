package com.tunapearl.saturi.domain.quiz;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@EqualsAndHashCode
@Getter @Setter
public class QuizChoicePk implements Serializable {

    protected QuizChoicePk(){}

    private Long quizId;
    private Long choiceId;

    /*
    * 생성 메서드
    */
    public static QuizChoicePk createChoicePk(Long choiceId){
        QuizChoicePk choicePk = new QuizChoicePk();
        choicePk.choiceId = choiceId;
        return choicePk;
    }
}
