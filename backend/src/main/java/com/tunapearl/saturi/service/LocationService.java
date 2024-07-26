package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    @Transactional
    public void createLiationSample(String name) {
        List<LocationEntity> locations = new ArrayList<>();
        LocationEntity location = new LocationEntity();
        location.setName(name);
        locationRepository.save(location);
    }
}
