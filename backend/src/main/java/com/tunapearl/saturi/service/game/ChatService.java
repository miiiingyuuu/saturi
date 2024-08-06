package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.*;
import com.tunapearl.saturi.domain.game.person.PersonChatRoom;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.QuizMessage;
import com.tunapearl.saturi.dto.quiz.QuizDetailReadResponseDTO;
import com.tunapearl.saturi.repository.QuizRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameLogRepository;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
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
import java.util.List;
import java.util.Optional;

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
    private final RedisPublisher redisPublisher;

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

                if(gameRoomEntity.getStatus().equals(Status.IN_PROGRESS)){//모두 모임. 게임 시작하라

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
    public List<QuizEntity> getquizList(String topicId) {

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(topicId);

        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            Optional<List<Long>> quizIdListOptional = gameRoomQuizRepository.findQuizIdsByRoomId(roomId);
            if (quizIdListOptional.isPresent()) {

                List<Long> quizIdList = quizIdListOptional.get();
                List<QuizEntity> quizList = quizRepository.findByIdList(quizIdList);

                for (QuizEntity quizEntity : quizList) {
                    Hibernate.initialize((quizEntity.getLocation()));
                    quizEntity.getQuizChoiceList().forEach(Hibernate::initialize);
                }

                return quizList;
            }

            return null;

        } else {

            log.info("roomId가 없슈");
            return null;
        }
    }

    @Transactional
    public QuizMessage playGame(QuizMessage message) {

        //정답판단 로직
        QuizDetailReadResponseDTO quizDetailReadResponseDTO = quizService.findOne(message.getQuizId());

        String answer = "";
        //객관식인 경우
        if (quizDetailReadResponseDTO.getIsObjective()) {
            for (QuizDetailReadResponseDTO.Choice choice : quizDetailReadResponseDTO.getChoiceList()) {

                if (choice.getIsAnswer()) {//정답 선지 찾기
                    answer = choice.getChoiceId().toString();
                }
            }
        }
        //주관식인 경우
        else {
            answer = quizDetailReadResponseDTO.getChoiceList().get(0).getContent();
        }

        log.info("answer:{}", answer);
        log.info("message:{}", message.getMessage());

        if (message.getMessage().equals(answer)) {

            //최초정답자인경우만 GameRoomQuizEntity에 정답자 추가 및 GameRoomParticipantEntity count추가임
            Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(message.getRoomId());

            if (chatRoomOptional.isPresent()) {
                ChatRoom chatRoom = chatRoomOptional.get();
                long roomId = chatRoom.getRoomId();
                Optional<GameRoomQuizEntity> gameRoomQuiz = gameRoomQuizRepository.findQuizById(message.getQuizId(), roomId);
                if (gameRoomQuiz.isPresent()) {
                    GameRoomQuizEntity gameRoomQuizEntity = gameRoomQuiz.get();
                    if (gameRoomQuizEntity.getUser() == null) {
                        log.info("맞춘사람없슈!!");

                        //정답자 추가
                        UserEntity user = userService.findById(message.getSenderId());
                        gameRoomQuizService.updateGameRoomQuiz(gameRoomQuizEntity, user);

                        //게임방에 몇개 맞췄는지 업뎃하셈
                        GameRoomParticipantEntity participant = gameRoomParticipantService.findById(roomId,message.getSenderId());
                        gameRoomParticipantService.updateParticipant(participant);

                        //message에 맞췄다고 표시
                        message.setCorrect(true);
                    } else {
                        log.info("이미 누가 맞춤ㅋ");
                    }
                }
            } else {
                log.info("roomId가 없슈");
            }
        }

        //게임 로그 저장
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(message.getRoomId());
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();

            GameLogEntity gameLog = new GameLogEntity();
            UserEntity user = userRepository.findByUserId(message.getSenderId()).orElseThrow();
            gameLog.setUser(user);

            QuizEntity quiz = quizRepository.findById(message.getQuizId()).orElseThrow();
            gameLog.setQuiz(quiz);

            GameRoomEntity gameRoom = gameRoomRepository.findById(chatRoom.getRoomId()).orElseThrow();
            gameLog.setRoom(gameRoom);

            gameLog.setChatting(message.getMessage());
            gameLog.setChattingDt(LocalDateTime.now());
            long logId=gameLogRepository.save(gameLog);

            message.setChatLogId(logId);

        } else {

            log.info("ChatRoom with ID {} not found.", message.getRoomId());
        }

        return message;


    }
}
