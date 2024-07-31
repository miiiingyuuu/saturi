package com.tunapearl.saturi.utils;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.user.AgeRange;
import com.tunapearl.saturi.domain.user.Gender;
import com.tunapearl.saturi.domain.user.BirdEntity;
import com.tunapearl.saturi.dto.user.UserRegisterRequestDTO;
import com.tunapearl.saturi.service.GameService;
import com.tunapearl.saturi.service.lesson.AdminLessonService;
import com.tunapearl.saturi.service.user.BirdService;
import com.tunapearl.saturi.service.user.LocationService;
import com.tunapearl.saturi.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 실행 시 샘플 데이터 추가를 위한 class
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupApplicationListener {
    
    private final LocationService locationService;
    private final BirdService birdService;
    private final UserService userService;
    private final GameService gameService;
    private final AdminLessonService adminLessonService;

    private static final String[] LOCATION_NAMES = {"default", "gyungsang", "gyunggi", "gangwon", "chungcheong", "jeonra", "jeju"};
    private static final String BASE_URL = "http://localhost:8080/bird/";
    private static final String[] BIRD_NAMES = {"agent", "banker", "clown", "sailor", "deckhand", "evil_king", "cavalry", "cute_killer",
            "store_owner", "miner", "oil_mogul", "redhair", "scout", "secret_society", "showhost", "mercenary",
            "engineer", "musketeer"};
    private static final String[] BIRD_DESCRIPTIONS = {"요원", "은행원", "어릿광대", "선원", "갑판원", "악의수장", "총기병", "귀여운 살인마",
            "잡화상", "광부", "석유부자", "빨간머리", "정찰대", "비밀결사", "쇼호스트", "용병",
            "기관사", "삼총사"};

    private static final String[] Tips = {"타자가 빠르면 유리합니다.", "손가락의 유연성을 높이기 위한 운동을 하세요.", "화면을 주의 깊게 살펴보며 빠르게 대응하세요.",
            "손가락을 워밍업하고 시작하세요.", "빠른 판단력이 중요합니다."};
    private static final String[] LESSON_CATEGORIES = {"일상", "드라마 대사", "영화 대사", "밈"};
    
    //TODO 레슨 샘플 데이터 등록 필요
    
    //TODO 퀴즈 샘플 데이터 등록 필요

    @EventListener
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        createLocation();
        createBird();
        createUser();
        createTip();
        createLessonCategory();
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
        UserRegisterRequestDTO userInfoBasic = new UserRegisterRequestDTO(
                "test@email.com", "password1!", "testnickname");
        UserRegisterRequestDTO userInfoAdmin = new UserRegisterRequestDTO(
                "admin@email.com", "password1!", "admintest");

        userService.registerUser(userInfoBasic);
        userService.registerAdminUser(userInfoAdmin);
    }

    private void createTip() {
        for (int i = 0; i < Tips.length; i++) {
            gameService.registTip(Tips[i]);
        }
    }
    private void createLessonCategory() {
        for (int i = 0; i < LESSON_CATEGORIES.length; i++) {
            LessonCategoryEntity lessonCategory = adminLessonService.createLessonCategory(LESSON_CATEGORIES[i]);
            log.info("create lessonCategory sample {}", lessonCategory);
        }
    }

}
