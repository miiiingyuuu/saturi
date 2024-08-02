package com.tunapearl.saturi.domain.quiz;

import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class GameRoomQuizEntity {

    @Id @GeneratedValue
    private GameRoomQuizId gameRoomQuizId;

    @Column(nullable = false)
    private LocalDateTime presentDt;

    @Column
    private LocalDateTime correctDt;

    @Column
    private Long sequence;
}
