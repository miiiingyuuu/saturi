package com.tunapearl.saturi.utils;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.BirdEntity;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.dto.user.UserRegisterRequestDTO;
import com.tunapearl.saturi.service.user.BirdService;
import com.tunapearl.saturi.service.user.LocationService;
import com.tunapearl.saturi.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 실행 시 샘플 데이터 추가를 위한 class
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupApplicationListener {

    private static final String[] LOCATION_NAMES = {"default", "gyungsang", "gyunggi", "gangwon", "chungcheong", "jeonra", "jeju"};
    private static final String BASE_URL = "http://localhost:8080/bird/";
    private static final String[] BIRD_NAMES = {"agent", "banker", "clown", "sailor", "deckhand", "evil_king", "cavalry", "cute_killer",
                                                "store_owner", "miner", "oil_mogul", "redhair", "scout", "secret_society", "showhost", "mercenary",
                                                "engineer", "musketeer"};
    private static final String[] BIRD_DESCRIPTIONS = {"요원", "은행원", "어릿광대", "선원", "갑판원", "악의수장", "총기병", "귀여운 살인마",
                                                        "잡화상", "광부", "석유부자", "빨간머리", "정찰대", "비밀결사", "쇼호스트", "용병",
                                                        "기관사", "삼총사"};

    private final LocationService locationService;
    private final BirdService birdService;
    private final UserService userService;

    @EventListener
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        createLocation();
        createBird();
        createUser();
    }

    private void createLocation() {
        for (String name : LOCATION_NAMES) {
            LocationEntity findLocation = locationService.createLocationSample(name);
        }
    }
    private void createBird() {
        for (int i = 0; i < BIRD_NAMES.length; i++) {
            birdService.createBirdSample(BIRD_NAMES[i], BIRD_DESCRIPTIONS[i], BASE_URL + BIRD_NAMES[i] + ".png");
        }
    }

    private void createUser() {
        UserRegisterRequestDTO userInfo = new UserRegisterRequestDTO(
                "test@email.com", "password1!", "testnickname",
                1L, Gender.DEFAULT, AgeRange.DEFAULT);
        userService.registerUser(userInfo);
    }
}
