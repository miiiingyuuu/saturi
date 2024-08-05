package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.game.GameLogEntity;
import com.tunapearl.saturi.domain.game.GameTipEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GameLogRepository {

    private final EntityManager em;

    public void save(GameLogEntity gameLogEntity) {
        em.persist(gameLogEntity);
    }
}
