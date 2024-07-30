package com.tunapearl.saturi.repository;

import com.tunapearl.saturi.domain.LocationEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.xml.stream.Location;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class LocationRepository {

    private final EntityManager em;

    public Long save(LocationEntity location) {
        em.persist(location);
        return location.getLocationId();
    }

    public Optional<LocationEntity> findById(Long locationId) {
        return Optional.ofNullable(em.find(LocationEntity.class, locationId));
    }
}
