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
    private QuizChoicePk quizChoicePK = new QuizChoicePk();

    @MapsId("quizId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private QuizEntity quiz;

    @Column
    private String content;

    @Column(name = "is_answer")
    private Boolean isAnswer;

    
    /*
    * 연관관계 편의 메서드
    */
    public void setQuiz(QuizEntity quiz) {
        this.quiz = quiz;
    }

    /*
    * 생성 메서드
    */
    // 퀴즈 답안 1개 생성
    public static QuizChoiceEntity createQuizChoice(Long choiceId, String content, Boolean isAnswer) {
        QuizChoiceEntity quizChoice = new QuizChoiceEntity();
        quizChoice.quizChoicePK.setChoiceId(choiceId);
        quizChoice.content = content;
        quizChoice.isAnswer = isAnswer;
        return quizChoice;
    }
}
