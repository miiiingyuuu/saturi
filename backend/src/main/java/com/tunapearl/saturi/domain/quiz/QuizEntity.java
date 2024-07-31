package com.tunapearl.saturi.domain.quiz;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.dto.admin.quiz.QuizRegisterRequestDto;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "quiz")
public class QuizEntity {

    protected QuizEntity() {}

    @Id @GeneratedValue
    @Column(unique = true, nullable = false, name = "quiz_id")
    private Long quizId;

    @ManyToOne(fetch = FetchType.LAZY) //하나의 지역이 여러 개의 문제를 가지고 있음
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false, name = "creation_dt")
    private LocalDateTime creationDt;

    @Column(nullable = false, name = "is_objective")
    private Boolean isObjective;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<QuizChoiceEntity> quizChoiceList = new ArrayList<>();

    /*
    * 생성 메서드
    */
    public static QuizEntity createQuiz(LocationEntity location, String question, Boolean isObjective, List<QuizRegisterRequestDto.Choice> registerDtoList) {
        QuizEntity quiz = new QuizEntity();
        quiz.location = location;
        quiz.question = question;
        quiz.creationDt = LocalDateTime.now();
        quiz.isObjective = isObjective;

        for(QuizRegisterRequestDto.Choice dto: registerDtoList){
            quiz.quizChoiceList.add(QuizChoiceEntity.createQuizChoice(dto.getChoiceId(), dto.getContent(), dto.getIsAnswer()));
        }
        return quiz;
    }
}
