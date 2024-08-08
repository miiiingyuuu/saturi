package com.tunapearl.saturi.domain.game;

import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
@Table(name = "game_room_participant")
public class GameRoomParticipantEntity {

    @EmbeddedId
    private GameRoomParticipantId id;

    @ManyToOne
    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    private GameRoomEntity gameRoom;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "match_rank")
    private int matchRank;

    @Column(name="correct_count")
    @ColumnDefault("0")
    private int correctCount;

    @Column(name="isExited")
    @ColumnDefault("false")
    private boolean isExited;

    @Column(name="before_exp")
    private Long beforeExp;

    public GameRoomParticipantEntity() {}

    public GameRoomParticipantEntity(GameRoomEntity gameRoom, UserEntity user) {
        this.id = new GameRoomParticipantId(gameRoom.getRoomId(), user.getUserId());
        this.gameRoom = gameRoom;
        this.user = user;
        this.beforeExp=user.getExp();
    }
}
