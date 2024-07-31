package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.user.BirdEntity;
import com.tunapearl.saturi.repository.BirdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BirdService {

    private final BirdRepository birdRepository;

    @Transactional
    public void createBirdSample(String name, String description) {
        BirdEntity bird = new BirdEntity();
        bird.setName(name);
        bird.setDescription(description);
        birdRepository.save(bird);
    }

    @Transactional(readOnly = true)
    public BirdEntity findById(Long birdId) {
        return birdRepository.findById(birdId).get();
    }
}
