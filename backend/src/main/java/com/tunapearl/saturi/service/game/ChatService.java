package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.game.ChatMessage;
import com.tunapearl.saturi.domain.game.ChatRoom;
import com.tunapearl.saturi.domain.game.PersonChatRoom;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import com.tunapearl.saturi.repository.redis.PersonChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {

    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    private final PersonChatRoomRepository personChatRoomRepository;
    private final ChatRoomRepository chatRoomRepository;

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

    public void playGame(ChatMessage message) {

        //TODO:정답처리, 로그 저장
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(message.getRoomId());

        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();

            //TopicId를 통해 roomId얻기
            //게임방번호랑 메시지받은거 log찍어본거임
            log.info("ChatRoom found: {}", chatRoom.getRoomId());
            log.info("Processing message: {}", message.getMessage());

        } else {

            log.info("ChatRoom with ID {} not found.", message.getRoomId());
        }
    }
}
