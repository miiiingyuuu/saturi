package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    @Transactional
    public LocationEntity createLocationSample(String name) {
        LocationEntity location = new LocationEntity();
        location.setName(name);
        Long findLocationId = locationRepository.save(location);
        return locationRepository.findById(findLocationId).orElse(null);
    }

    @Transactional(readOnly = true)
    public LocationEntity findById(Long LocationId) {
        return locationRepository.findById(LocationId).get();
    }
}
