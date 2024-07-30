package com.tunapearl.saturi.domain.game;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GameRoomParticipantId implements Serializable {

    private Long roomId;
    private Long userId;

    // hashCode와 equals 메서드
    @Override
    public int hashCode() {
        return Objects.hash(roomId, userId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        GameRoomParticipantId that = (GameRoomParticipantId) obj;
        return Objects.equals(roomId, that.roomId) && Objects.equals(userId, that.userId);
    }
}
