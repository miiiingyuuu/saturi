package com.tunapearl.saturi.domain.game;

import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    public GameRoomParticipantEntity() {}

    public GameRoomParticipantEntity(GameRoomEntity gameRoom, UserEntity user) {
        this.id = new GameRoomParticipantId(gameRoom.getRoomId(), user.getUserId());
        this.gameRoom = gameRoom;
        this.user = user;
    }
}
