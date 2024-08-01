package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.user.BirdEntity;
import com.tunapearl.saturi.repository.BirdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/bird")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BirdController {

    private final BirdRepository birdRepository;

    @GetMapping("/{birdId}")
    public ResponseEntity<BirdEntity> getBirdById(@PathVariable("birdId") Long birdId) {
        return ResponseEntity.ok(birdRepository.findById(birdId).orElse(null));
    }

}
