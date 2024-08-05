package com.tunapearl.saturi.domain.quiz;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDTO;
import com.tunapearl.saturi.dto.admin.quiz.QuizUpdateRequestDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString
@Table(name = "quiz")
public class QuizEntity {

    protected QuizEntity() {}

    @Id @GeneratedValue
    @Column(unique = true, nullable = false, name = "quiz_id")
    private Long quizId;

    @ManyToOne(fetch = FetchType.EAGER) //하나의 지역이 여러 개의 문제를 가지고 있음
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false, name = "creation_dt")
    private LocalDateTime creationDt;

    @Column(nullable = false, name = "is_objective")
    private Boolean isObjective;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizChoiceEntity> quizChoiceList = new ArrayList<>();



    /*
    * 연관관계 편의 메서드
    */
    public void addQuizChoice(QuizChoiceEntity quizChoiceEntity) {
        quizChoiceList.add(quizChoiceEntity);
        quizChoiceEntity.setQuiz(this);
    }


    /*
    * 생성 메서드
    */
    public static QuizEntity createQuiz(LocationEntity location, String question, Boolean isObjective, List<QuizRegisterRequestDTO.Choice> registerDtoList) {
        QuizEntity quiz = new QuizEntity();
        quiz.location = location;
        quiz.question = question;
        quiz.creationDt = LocalDateTime.now();
        quiz.isObjective = isObjective;

        for(QuizRegisterRequestDTO.Choice dto: registerDtoList){
            QuizChoiceEntity choice = QuizChoiceEntity.createQuizChoice(dto.getChoiceId(), dto.getContent(), dto.getIsAnswer());
            quiz.addQuizChoice(choice);
        }
        return quiz;
    }

    /*
    *  수정 메서드
    */
    public static QuizEntity updateQuiz(QuizEntity quiz, QuizUpdateRequestDTO updateDto, LocationEntity location) {
        quiz.location = location;
        quiz.question = updateDto.getQuestion();
        quiz.creationDt = LocalDateTime.now();
        quiz.isObjective = updateDto.getIsObjective();

        quiz.quizChoiceList.clear();
        for(QuizUpdateRequestDTO.Choice choice: updateDto.getChoiceList()){
            QuizChoiceEntity entity = QuizChoiceEntity.createQuizChoice(choice.getChoiceId(), choice.getContent(), choice.getIsAnswer());
            quiz.addQuizChoice(entity);
        }
        return quiz;
    }
}
