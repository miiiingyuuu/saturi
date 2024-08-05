package com.tunapearl.saturi.domain.game;

import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "game_room_quiz")
public class GameRoomQuizEntity {

    @EmbeddedId
    private GameRoomQuizId gameRoomQuizId = new GameRoomQuizId();

    @MapsId("roomId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private GameRoomEntity room;

    @MapsId("quizId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private QuizEntity quiz;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false)
    private LocalDateTime presentDt;

    @Column
    private LocalDateTime correctDt;

    @Column
    private Long sequence;

    public void setGameRoom(GameRoomEntity gameRoom){
        this.room = gameRoom;
    }

    public static GameRoomQuizEntity create(GameRoomEntity room, QuizEntity quiz, Long sequence){
        GameRoomQuizEntity grQuiz = new GameRoomQuizEntity();

        // 어떤 방에서 출제됐는지 설정
        grQuiz.gameRoomQuizId.setRoomId(room.getRoomId());
        room.addQuiz(grQuiz);

        // 어떤 퀴즈가 출제됐는지 설정
        grQuiz.gameRoomQuizId.setQuizId(quiz.getQuizId());
        grQuiz.quiz = quiz;

        // 출제 시간, 순서
        grQuiz.presentDt = LocalDateTime.now();
        grQuiz.sequence = sequence;
        return grQuiz;
    }
}
