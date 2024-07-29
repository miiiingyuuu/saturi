package com.tunapearl.saturi.domain.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "game_tip")
public class GameTipEntity {

    @Id @GeneratedValue
    @Column(name="tip_id")
    private int tipId;

    @Column(length=500)
    private String content;
}
