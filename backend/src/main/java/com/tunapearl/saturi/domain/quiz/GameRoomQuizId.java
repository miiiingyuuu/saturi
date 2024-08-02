package com.tunapearl.saturi.domain.quiz;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Getter @Setter
public class GameRoomQuizId implements Serializable {
    private Long roomId;
    private Long quizId;
}
