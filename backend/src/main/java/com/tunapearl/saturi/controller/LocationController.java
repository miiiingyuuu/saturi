package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LocationController {
    /**
     * 유저에 지역 추가 후 유저 테스트 하기위한 임시 컨트롤러
     */

    private final LocationRepository locationRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<String> registerLocation(@RequestParam("location-name") String locationName) {
        log.info("received request to register a new location for {}", locationName);
        LocationEntity location = new LocationEntity();
        location.setName(locationName);
        locationRepository.save(location);
        return ResponseEntity.ok().body("ok");
    }
}
