package com.tunapearl.saturi.utils;

import com.tunapearl.saturi.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 실행 시 샘플 데이터 추가를 위한 class
 */
@Component
@RequiredArgsConstructor
public class StartupApplicationListener {

    private final LocationService locationService;

    @EventListener
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        List<String> names = new ArrayList<>();
        names.add("default");
        names.add("gyungsang");
        names.add("gyunggi");
        for (String name : names) {
            locationService.createLiationSample(name);
        }
    }
}
