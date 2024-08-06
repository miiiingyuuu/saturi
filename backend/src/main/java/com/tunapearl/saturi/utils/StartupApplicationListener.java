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
        //5. 게임 퀴즈 추가
        createGameQuiz();
    }

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
