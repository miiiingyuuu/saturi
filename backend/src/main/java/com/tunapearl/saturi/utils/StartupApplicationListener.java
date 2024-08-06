package com.tunapearl.saturi.utils;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonCategoryEntity;
import com.tunapearl.saturi.domain.lesson.LessonEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.lesson.LessonSaveRequestDTO;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.dto.user.UserRegisterRequestDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.SampleDataRepository;
import com.tunapearl.saturi.service.QuizService;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 실행 시 샘플 데이터 추가를 위한 class
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupApplicationListener {
    
    private final LocationService locationService;
    private final AdminLessonService adminLessonService;
    private final LessonService lessonService;
    private final QuizService quizService;

    private static final String[] LESSON_SCRIPT = {"가가가가", "블루베리스무디", "어느정도높이까지올라가는거에요", "어어어", "이에이승"};
    private static final String[] LESSON_PATH = {"https://storage.cloud.google.com/saturi/%EA%B0%80%EA%B0%80%EA%B0%80%EA%B0%80.wav",
            "https://storage.cloud.google.com/saturi/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%EC%8A%A4%EB%AC%B4%EB%94%94.wav",
            "https://storage.cloud.google.com/saturi/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%EC%8A%A4%EB%AC%B4%EB%94%94.wav",
            "https://storage.cloud.google.com/saturi/%EC%96%B4%EC%96%B4%EC%96%B4.wav",
            "https://storage.cloud.google.com/saturi/%EC%9D%B4%EC%97%90%EC%9D%B4%EC%8A%B9.wav"};
    private static final String[] LESSON_VOICE_FILE_NAME = {"가가가가", "블루베리스무디", "어느정도높이까지올라가는거에요", "어어어", "이에이승"};
    private static final Long LESSON_TEST_USER_ID = 15L;

    //TODO 퀴즈 샘플 데이터 등록 필요
    private final static String[] QUIZ_QUESTION = {
            "만다꼬 그라노에서 '만다꼬'의 뜻으로 알맞은 것은?",
            "애비다 의 뜻으로 알맞은 것은?",
            "어디까지올라가는거에요의 음정으로 알맞은 것은?",
            "다음 중 '어어어 그 옷 파이다' 에서 '파이다'의 뜻을 잘 해석한 것은?",
            "다음 중 경상도 사투리가 아닌 것은?",
            "쪼매의 뜻은?",
            "퍼뜩의 뜻은?",
            "표준어 그만을 경상도 사투리로 바꾸면?",
            "고닥꾜솩쌔미의 뜻은?",
            "디비라의 뜻은?"
    };
    private final static String[][] QUIZ_CHOICE_LIST = {
            {"가만 두라고", "뭐 한다고", "그만 두라고", "많다고"},
            {"야위다", "아프다", "예쁘다", "Im your father"},
            {"도레미파솔라시도레미레", "도레미파솔라시도레미파", "레미레도시라솔파미레도", "도레미파솔라시도시도레"},
            {"파였다", "별로다", "Pie다", "π"},
            {"정구지", "단디", "솔", "잠온다"},
            {"조금", "", "", ""},
            {"빨리", "", "", ""},
            {"고마", "", "", ""},
            {"고등학교 수학 선생님이", "", "", ""},
            {"뒤집어라", "", "", ""}
    };
    private final static Boolean[][] QUIZ_CHOICE_ANSWER_LIST = {
            {false, true, false, false},
            {true, false, false, false},
            {true, false, false, false},
            {false, true, false, false},
            {false, false, true, false},
            {true, false, false, false},
            {true, false, false, false},
            {true, false, false, false},
            {true, false, false, false},
            {true, false, false, false}
    };


    @EventListener
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {

        // 4. 학습 관련 추가
        createLessonSamples();

        //5. 게임 퀴즈 추가
        createGameQuiz();
    }


    /**
     * 학습 관련 샘플 데이터 추가
     */
    private void createLessonSamples() {

        // 6. 학습 추가(5번 추가 이후)
        createLesson();

        // 7. 레슨 그룹 결과 생성(6번 추가 이후)
        createLessonGroupResult();

        // 8. 레슨 결과 생성(7번 추가 이후)
        createLessonResult();
    }

    /**
     * 레슨 test data (lessonGroupId1에 5문제)
     */
    private void createLesson() {
        LessonGroupEntity lessonGroup = lessonService.findByIdLessonGroup(1L);
        for (int i = 0; i < 5; i++) {
            adminLessonService.createLesson(lessonGroup, LESSON_SCRIPT[i], LESSON_PATH[i], LESSON_VOICE_FILE_NAME[i]);
        }
    }
    /**
     * lessonGroupResult 테이블 생성
     */
    private void createLessonGroupResult() {
        Long lessonGroupResultId = lessonService.createLessonGroupResult(LESSON_TEST_USER_ID, 1L);// userId 7, lessonGroupId 1
    }

    /**
     * lessonResult 생성
     */
    private void createLessonResult() {
        for (int i = 1; i <= 5; i++) {
            LessonSaveRequestDTO lessonSaveRequest = new LessonSaveRequestDTO((long)i, 1L, 77L, 77L, "test file path", "test file name", "[0, 1, 2, 3, 4]", "[55, 33, 22, 11, 44]", "나는 바보입니다");
            lessonService.saveLessonSample(lessonSaveRequest, LocalDateTime.now().minusDays(i-1));
        }
    }

    //TODO lessonGroupResult 저장

    /*
    * quiz samples 생성
    */
    private void createGameQuiz() {

        for(int i = 0; i < 10; i++){
            List<QuizRegisterRequestDTO.Choice> choices = new ArrayList<>();
            for(int j = 0; j < 4; j++){
                if (!QUIZ_CHOICE_LIST[i][j].isEmpty()) {
                    choices.add(QuizRegisterRequestDTO.Choice.builder()
                            .choiceId((long) j+1)
                            .content(QUIZ_CHOICE_LIST[i][j])
                            .isAnswer(QUIZ_CHOICE_ANSWER_LIST[i][j])  // 실제 답인지 여부를 설정해야 합니다.
                            .build());
                }
            }

            QuizRegisterRequestDTO request = QuizRegisterRequestDTO.builder()
                    .locationId(2L)
                    .question(QUIZ_QUESTION[i])
                    .isObjective(true)
                    .choiceList(choices)
                    .build();

            quizService.saveQuiz(request);
        }
    }
}
