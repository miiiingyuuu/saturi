package com.tunapearl.saturi.repository;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.user.BirdEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class BirdRepository {

    private final EntityManager em;

    public void save(BirdEntity bird) {
        em.persist(bird);
    }

    public Optional<BirdEntity> findById(Long birdId) {
        return Optional.ofNullable(em.find(BirdEntity.class, birdId));
    }
}
