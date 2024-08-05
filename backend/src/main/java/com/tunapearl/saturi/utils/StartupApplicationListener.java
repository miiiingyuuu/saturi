package com.tunapearl.saturi.utils;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.user.UserRegisterRequestDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.service.game.GameService;
import com.tunapearl.saturi.service.lesson.AdminLessonService;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.service.user.BirdService;
import com.tunapearl.saturi.service.user.LocationService;
import com.tunapearl.saturi.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    private final LessonService lessonService;

    private static final String[] LOCATION_NAMES = {"default", "gyungsang", "gyunggi", "gangwon", "chungcheong", "jeonra", "jeju"};
    private static final String[] BIRD_NAMES = {"agent", "banker", "clown", "sailor", "deckhand", "evil_king", "cavalry", "cute_killer",
            "store_owner", "miner", "oil_mogul", "redhair", "scout", "secret_society", "showhost", "mercenary",
            "engineer", "musketeer"};
    private static final String[] BIRD_DESCRIPTIONS = {"요원", "은행원", "어릿광대", "선원", "갑판원", "악의수장", "총기병", "귀여운 살인마",
            "잡화상", "광부", "석유부자", "빨간머리", "정찰대", "비밀결사", "쇼호스트", "용병",
            "기관사", "삼총사"};

    private static final String[] Tips = {"타자가 빠르면 유리합니다.", "손가락의 유연성을 높이기 위한 운동을 하세요.", "화면을 주의 깊게 살펴보며 빠르게 대응하세요.",
            "손가락을 워밍업하고 시작하세요.", "빠른 판단력이 중요합니다."};
    private static final String[] LESSON_CATEGORIES = {"일상", "드라마 대사", "영화 대사", "밈"};
    private static final String[] LESSON_GROUP_NAME = {"첫번째 퍼즐", "두번째 퍼즐", "세번째 퍼즐", "네번째 퍼즐", "다섯번째 퍼즐"};
    private static final String[] LESSON_SCRIPT = {"가가가가", "블루베리스무디", "어느정도높이까지올라가는거에요", "어어어", "이에이승"};
    private static final String[] LESSON_PATH = {"https://storage.cloud.google.com/saturi/%EA%B0%80%EA%B0%80%EA%B0%80%EA%B0%80.wav",
            "https://storage.cloud.google.com/saturi/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%EC%8A%A4%EB%AC%B4%EB%94%94.wav",
            "https://storage.cloud.google.com/saturi/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%EC%8A%A4%EB%AC%B4%EB%94%94.wav",
            "https://storage.cloud.google.com/saturi/%EC%96%B4%EC%96%B4%EC%96%B4.wav",
            "https://storage.cloud.google.com/saturi/%EC%9D%B4%EC%97%90%EC%9D%B4%EC%8A%B9.wav"};
    private static final String[] LESSON_VOICE_FILE_NAME = {"가가가가", "블루베리스무디", "어느정도높이까지올라가는거에요", "어어어", "이에이승"};


    //TODO 퀴즈 샘플 데이터 등록 필요

    @EventListener
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        createLocation(); // 지역 샘플 추가(
        createBird();
        createUser();
        createTip();
        createLessonCategory();
        createLessonGroup();
        createLesson();
    }

    private void createLocation() {
        for (String name : LOCATION_NAMES) {
            LocationEntity findLocation = locationService.createLocationSample(name);
        }
    }

    private void createBird() {
        for (int i = 0; i < BIRD_NAMES.length; i++) {
            birdService.createBirdSample(BIRD_NAMES[i], BIRD_DESCRIPTIONS[i]);
        }
    }

    private void createUser() {

        UserRegisterRequestDTO userInfoBasic;
        for(int i=1;i<15;i++){
            userInfoBasic = new UserRegisterRequestDTO(
                    "test"+i+"@email.com", "password1!", "testnickname"+i);

            userService.registerUser(userInfoBasic);
        }
        UserRegisterRequestDTO userInfoAdmin = new UserRegisterRequestDTO(
                "admin@email.com", "password1!", "admintest");
        UserRegisterRequestDTO userInfoAdmin1 = new UserRegisterRequestDTO(
                "adminback@email.com", "password1!", "adminbacktest");

        userService.registerAdminUser(userInfoAdmin);
        userService.registerAdminUser(userInfoAdmin1);
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

    private void createLessonGroup() {
        List<LocationEntity> locations = locationService.findAll();
        List<LessonCategoryEntity> lessonCategories = lessonService.findAllLessonCategory();
        for (int i = 1; i < 3; i++) {
            LocationEntity location = locations.get(i);
            for (int j = 0; j < 4; j++) {
                LessonCategoryEntity lessonCategory = lessonCategories.get(j);
                for (int k = 0; k < LESSON_GROUP_NAME.length; k++) {
                    String lessonGroupName = location.getName() + " " + lessonCategory.getName() + " " + LESSON_GROUP_NAME[k];
                    adminLessonService.createLessonGroup(location, lessonCategory, lessonGroupName);
                }
            }
        }
    }

    private void createLesson() {
        LessonGroupEntity lessonGroup = lessonService.findByIdLessonGroup(1L);
        for (int i = 0; i < 5; i++) {
            adminLessonService.createLesson(lessonGroup, LESSON_SCRIPT[i], LESSON_PATH[i], LESSON_VOICE_FILE_NAME[i]);
        }
    }
}
