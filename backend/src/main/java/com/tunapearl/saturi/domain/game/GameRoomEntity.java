package com.tunapearl.saturi.domain.game;

import com.tunapearl.saturi.domain.LocationEntity;
import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "game_room")
public class GameRoomEntity {
    @Id @GeneratedValue
    @Column(name="room_id")
    private long roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @Column(name="start_dt")
    private LocalDate startDt;

    @Column(name="end_dt")
    private LocalDate endDt;
}
