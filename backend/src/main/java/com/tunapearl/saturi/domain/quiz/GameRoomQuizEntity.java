package com.tunapearl.saturi.domain.quiz;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class GameRoomQuizEntity {

    @Id @GeneratedValue
    private GameRoomQuizId gameRoomQuizId;

    // @ManyToOne(fetch = FetchType.LAZY)


    @Column(nullable = false)
    private LocalDateTime presentDt;

    @Column
    private LocalDateTime correctDt;

    @Column
    private Long sequence;
}
