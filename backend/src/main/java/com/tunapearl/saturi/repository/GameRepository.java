package com.tunapearl.saturi.repository;

import com.tunapearl.saturi.domain.game.GameTipEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GameRepository {

    private final EntityManager em;

    public int saveTip(GameTipEntity gametip) {
        em.persist(gametip);
        return gametip.getTipId();
    }

    public Optional<List<GameTipEntity>> getTip() {
        List<GameTipEntity> results =
                em.createQuery("select g from GameTipEntity g", GameTipEntity.class)
                        .setMaxResults(5)
                        .getResultList();

        return results.isEmpty() ? Optional.empty() : Optional.of(results);
    }
}
