package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.game.Status;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GameRoomRepository {

    @PersistenceContext
    private final EntityManager em;

    public GameRoomEntity saveGameRoom(GameRoomEntity gameRoom) {
        em.persist(gameRoom);
        return gameRoom;
    }

    public Optional<List<GameRoomEntity>> findByLocationAndStatus(LocationEntity location, Status status) {
        List<GameRoomEntity> results = em.createQuery("select gr from GameRoomEntity gr where gr.location = :location and gr.status = :status", GameRoomEntity.class)
                .setParameter("location", location)
                .setParameter("status", status)
                .getResultList();

        return results.isEmpty() ? Optional.empty() : Optional.of(results);
    }

    /*
    * id로 단건 조회
    */
    public Optional<GameRoomEntity> findById(Long roomId){
        return Optional.of(em.find(GameRoomEntity.class, roomId));
    }

    public GameRoomEntity updateGameRoom(GameRoomEntity gameRoom) {
        return em.merge(gameRoom);
    }
}
