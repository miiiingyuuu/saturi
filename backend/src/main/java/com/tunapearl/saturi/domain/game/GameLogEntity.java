package com.tunapearl.saturi.domain.game;

import com.tunapearl.saturi.domain.quiz.GameRoomQuizEntity;
import com.tunapearl.saturi.domain.user.BirdEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "game_log")
public class GameLogEntity {
    @Id
    @GeneratedValue
    @Column(name="game_log_id")
    private long gameLogId;




}
