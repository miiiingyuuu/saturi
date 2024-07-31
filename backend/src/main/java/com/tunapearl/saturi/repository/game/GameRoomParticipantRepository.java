package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class GameRoomParticipantRepository {

    @PersistenceContext
    private final EntityManager em;

    public void saveGameRoomParticipant(GameRoomParticipantEntity gameRoomParticipantEntity) {

        em.persist(gameRoomParticipantEntity);
    }

    public List<GameRoomParticipantEntity> findByRoomId(Long roomId) {
        return em.createQuery("select p from GameRoomParticipantEntity p where p.id.roomId = :roomId", GameRoomParticipantEntity.class)
                .setParameter("roomId", roomId)
                .getResultList();
    }
}
