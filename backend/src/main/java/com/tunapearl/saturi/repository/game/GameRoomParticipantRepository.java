package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GameRoomParticipantRepository {

    private final EntityManager em;

    public void saveGameRoomParticipant(GameRoomParticipantEntity gameRoomParticipantEntity) {

        em.persist(gameRoomParticipantEntity);
    }
}
