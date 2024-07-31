package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.game.Status;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GameRoomRepository {

    private final EntityManager em;

    public long saveGameRoom(final GameRoomEntity gameRoom) {
        em.persist(gameRoom);
        return gameRoom.getRoomId();
    }
    public Optional<List<GameRoomEntity>> findByStatus(Status status) {
        List<GameRoomEntity> results = em.createQuery("select gr from GameRoomEntity gr where gr.status = :status", GameRoomEntity.class)
                .setParameter("status", status)
                .getResultList();

        return results.isEmpty() ? Optional.empty() : Optional.of(results);
    }
}
