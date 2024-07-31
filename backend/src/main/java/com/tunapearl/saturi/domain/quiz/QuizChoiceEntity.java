package com.tunapearl.saturi.domain.quiz;

import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDto;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "quiz_choice")
public class QuizChoiceEntity {

    protected QuizChoiceEntity() {}

    @EmbeddedId
    private QuizChoiceId quizChoicePK;

    @ManyToOne(fetch = FetchType.LAZY)
    private QuizEntity quiz;

    @Column
    private String content;

    @Column(name = "is_answer")
    private Boolean isAnswer;


    /*
    * 생성 메서드
    */
    public QuizChoiceEntity createQuizChoice(Long choiceId, String content, Boolean isAnswer) {
        QuizChoiceEntity quizChoice = new QuizChoiceEntity();
//        quizChoice.quizChoicePK.choiceId =
        quizChoice.content = content;
        quizChoice.isAnswer = isAnswer;
        return quizChoice;
    }
    public static List<QuizChoiceEntity> createQuizChoiceList(List<QuizRegisterRequestDto.Choice> choiceList) {
        List<QuizChoiceEntity> list = new ArrayList<>();
        for(QuizRegisterRequestDto.Choice choice: choiceList){
            QuizChoiceEntity quizChoice = new QuizChoiceEntity();
//            quizChoice.quizChoiceId.getChoice_id() = choice.getChoiceId();
            list.add(quizChoice);
        }
        return list;
    }

}
