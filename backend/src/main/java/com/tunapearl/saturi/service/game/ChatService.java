package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.GameLogEntity;
import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.game.person.PersonChatRoom;
import com.tunapearl.saturi.domain.game.room.ChatMessage;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.domain.quiz.QuizEntity;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.QuizMessage;
import com.tunapearl.saturi.repository.QuizRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameLogRepository;
import com.tunapearl.saturi.repository.game.GameRoomQuizRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import com.tunapearl.saturi.repository.redis.PersonChatRoomRepository;
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
    public void enterGameRoom(String roomId) {
        ChannelTopic topic = getRoomTopic(roomId);
        if (topic == null)
            topic = new ChannelTopic(roomId);

        redisMessageListener.addMessageListener(redisSubscriber, topic);
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
                List<QuizEntity>quizList=quizRepository.findByIdList(quizIdList);

                for(QuizEntity quizEntity:quizList){
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
    public void playGame(QuizMessage message) {

        //TODO:정답처리, 로그 저장
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(message.getRoomId());

        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();

            GameLogEntity gameLog=new GameLogEntity();
            UserEntity user=userRepository.findByUserId(message.getSenderId()).orElseThrow();
            gameLog.setUser(user);

            QuizEntity quiz=quizRepository.findById(message.getQuizId()).orElseThrow();
            gameLog.setQuiz(quiz);

            GameRoomEntity gameRoom=gameRoomRepository.findById(chatRoom.getRoomId()).orElseThrow();
            gameLog.setRoom(gameRoom);

            gameLog.setChatting(message.getMessage());
            gameLog.setChattingDt(LocalDateTime.now());
            gameLogRepository.save(gameLog);

        } else {

            log.info("ChatRoom with ID {} not found.", message.getRoomId());
        }
    }
}
