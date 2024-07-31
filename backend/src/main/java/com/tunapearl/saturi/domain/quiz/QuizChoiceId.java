package com.tunapearl.saturi.domain.quiz;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Getter
public class QuizChoiceId implements Serializable {
    private Long quizId;
    private Long choiceId;
}
