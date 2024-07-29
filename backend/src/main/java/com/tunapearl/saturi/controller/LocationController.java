package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LocationController {

    private final LocationRepository locationRepository;

    /**
     * 지역 등록
     */
    @PostMapping
    @Transactional
    public ResponseEntity<String> registerLocation(@RequestParam("location-name") String locationName) {
        log.info("received request to register a new location for {}", locationName);
        LocationEntity location = new LocationEntity();
        location.setName(locationName);
        locationRepository.save(location);
        return ResponseEntity.ok().body("ok");
    }

    /**
     * 모든 지역 조회
     */
    @GetMapping
    public ResponseEntity<List<LocationEntity>> getAllLocations() {
        log.info("received request to get all locations");
        return ResponseEntity.of(locationRepository.findAll());
    }
}
