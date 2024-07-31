package com.tunapearl.saturi.domain.game;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "quiz_choice")
public class QuizChoiceEntity {

    @EmbeddedId
    private QuizChoiceId quizChoiceId;

    @ManyToOne(fetch = FetchType.LAZY)
    private QuizEntity quiz;

    @Column
    private String content;

    @Column(name = "is_answer")
    private Boolean isAnswer;
}
