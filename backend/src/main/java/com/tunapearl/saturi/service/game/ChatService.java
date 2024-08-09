package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.*;
import com.tunapearl.saturi.domain.game.person.PersonChatRoom;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.domain.quiz.QuizChoiceEntity;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.GameResultResponseDTO;
import com.tunapearl.saturi.dto.game.QuizMessage;
import com.tunapearl.saturi.dto.quiz.QuizDetailReadResponseDTO;
import com.tunapearl.saturi.repository.QuizRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameLogRepository;
import com.tunapearl.saturi.repository.game.GameRoomQuizRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import com.tunapearl.saturi.repository.redis.PersonChatRoomRepository;
import com.tunapearl.saturi.service.GameRoomParticipantService;
import com.tunapearl.saturi.service.GameRoomQuizService;
import com.tunapearl.saturi.service.QuizService;
import com.tunapearl.saturi.service.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {

    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    private final PersonChatRoomRepository personChatRoomRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final GameRoomQuizRepository gameRoomQuizRepository;
    private final QuizRepository quizRepository;
    private final GameLogRepository gameLogRepository;
    private final UserRepository userRepository;
    private final GameRoomRepository gameRoomRepository;
    private final QuizService quizService;
    private final GameRoomQuizService gameRoomQuizService;
    private final UserService userService;
    private final GameRoomParticipantService gameRoomParticipantService;

    /**
     * 개인방 관련 메소드
     */
    public void enterPersonRoom(String roomId) {
        ChannelTopic topic = getPersonTopic(roomId);
        if (topic == null)
            topic = new ChannelTopic(roomId);

        redisMessageListener.addMessageListener(redisSubscriber, topic);
    }


    public Optional<PersonChatRoom> getPersonRoom(String roomId) {
        return Optional.ofNullable(personChatRoomRepository.findById(roomId).orElse(null));
    }


    public ChannelTopic getPersonTopic(String roomId) {

        PersonChatRoom personChatRoom = getPersonRoom(roomId).get();

        if (personChatRoom != null)
            return new ChannelTopic(personChatRoom.getPersonchatroomId());
        else {
            log.info("topic이 없슈");
            return null;//topic이 없슈
        }
    }

    /**
     * 아래부터는 게임방 관련 메소드
     */
    public boolean enterGameRoom(String topicId) {
        ChannelTopic topic = getRoomTopic(topicId);
        if (topic == null)
            topic = new ChannelTopic(topicId);

        redisMessageListener.addMessageListener(redisSubscriber, topic);

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(topicId);

        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            GameRoomEntity gameRoomEntity = gameRoomRepository.findById(roomId).orElse(null);
            if (gameRoomEntity != null) {
                log.info("게임방은 있슈");

                if (gameRoomEntity.getStatus().equals(Status.IN_PROGRESS)) {//모두 모임. 게임 시작하라
                    return true;//게임을 시작하라
                }
            }
        }
        return false;//아직 덜 모음
    }

    public Optional<ChatRoom> getChatRoom(String roomId) {
        return Optional.ofNullable(chatRoomRepository.findById(roomId).orElse(null));
    }

    public ChannelTopic getRoomTopic(String roomId) {

        ChatRoom chatRoom = getChatRoom(roomId).get();
        if (chatRoom != null)
            return new ChannelTopic(chatRoom.getTopicId());
        else {
            log.info("topic이 없슈");
            return null;//topic이 없슈
        }
    }

    @Transactional
    public QuizMessage playGame(QuizMessage message) {

        log.info("message(playGame): {}", message.toString());

        //방 레디스
        ChatRoom chatRoom = chatRoomRepository.findById(message.getRoomId())
                .orElseThrow(() -> new RuntimeException("Not found chat room"));

        //방 번호, 퀴즈 번호 추출
        Long roomId = chatRoom.getRoomId();
        Long quizId = message.getQuizId();

        log.info("chatRoom(playGame): {}", chatRoom.toString());

        if (message.getQuizId() > 1) {
            // 방번호, 퀴즈번호로 조회
            GameRoomQuizEntity gameRoomQuiz = gameRoomQuizRepository.findPosedQuizByRoomAndQuizId(roomId, quizId)
                    .orElseThrow(() -> new RuntimeException(String.format("Not found game room quiz: %d, %d", roomId, quizId)));
            QuizEntity quiz = gameRoomQuiz.getQuiz();

            //정답판단 로직
            //객관식인 경우
            String answer = "";
            if (quiz.getIsObjective()) {
                answer = String.valueOf(findIndexWithIsAnswerTrue(quiz.getQuizChoiceList()));
            }
            //주관식인 경우
            else {
                answer = quiz.getQuizChoiceList().get(0).getContent();
            }

            //정답을 제일 먼저 맞춤
            if (message.getMessage().equals(answer) && gameRoomQuiz.getUser() == null) {
                //정답자 추가
                UserEntity user = userService.findById(message.getSenderId());
                gameRoomQuizService.updateGameRoomQuiz(gameRoomQuiz, user);

                //게임방에 몇개 맞췄는지 업뎃하셈
                GameRoomParticipantEntity participant = gameRoomParticipantService.findById(roomId, message.getSenderId());
                gameRoomParticipantService.updateParticipant(participant);

                //message에 맞췄다고 표시
                message.setCorrect(true);
            }
        }

        //게임 로그 저장
        GameLogEntity gameLog = new GameLogEntity();
        UserEntity user = userRepository.findByUserId(message.getSenderId()).orElseThrow();
        gameLog.setUser(user);

        QuizEntity quiz = quizRepository.findById(message.getQuizId()).orElseThrow();
        gameLog.setQuiz(quiz);

        GameRoomEntity gameRoom = gameRoomRepository.findById(chatRoom.getRoomId()).orElseThrow();
        gameLog.setRoom(gameRoom);

        gameLog.setChatting(message.getMessage());
        gameLog.setChattingDt(LocalDateTime.now());
        long logId = gameLogRepository.save(gameLog);

        message.setChatLogId(logId);
        return message;
    }

    @Transactional
    public void terminateGameRoom(String topicId) {

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(topicId);
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            GameRoomEntity gameRoomEntity = gameRoomRepository.findById(roomId).orElseThrow();
            gameRoomEntity.setStatus(Status.TERMINATED);
            gameRoomEntity.setEndDt(LocalDateTime.now());
        }
    }

    @Transactional
    public void endGameRoom(String topicId) {
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(topicId);
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            GameRoomEntity gameRoomEntity = gameRoomRepository.findById(roomId).orElseThrow();

            if (gameRoomEntity.getStatus() == Status.IN_PROGRESS) {

                //게임방 상태 변경
                gameRoomEntity.setStatus(Status.COMPLETED);
                gameRoomEntity.setEndDt(LocalDateTime.now());


                //순위 저장
                List<GameRoomParticipantEntity> participants = gameRoomParticipantService.findParticipantByRoomIdOrderByCorrectCount(roomId);

                int rank = 1;
                int pre = -1;//이전 참가자 맞춘 횟수
                int same = 0;//점수 같은 사람 수
                for (GameRoomParticipantEntity participant : participants) {

                    if (pre > participant.getCorrectCount()) {
                        rank += same;
                        same = 1;
                    } else {//동점자
                        same++;
                    }
                    pre = participant.getCorrectCount();

                    UserEntity user = participant.getUser();
                    participant.setMatchRank(rank);//순위 저장

                    int count = participant.getCorrectCount();
                    user.setExp(participant.getBeforeExp() + count * 2);
                }
            }
        }
    }

    private int findIndexWithIsAnswerTrue(List<QuizChoiceEntity> list){
        return (IntStream.range(0, list.size())
                .filter(i -> list.get(i).getIsAnswer())
                .findFirst()
                .orElse(-1) + 1);
    }
}
