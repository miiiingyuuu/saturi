package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import com.tunapearl.saturi.domain.game.GameRoomParticipantId;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameRoomParticipantService {

    private final GameRoomParticipantRepository gameRoomParticipantRepository;
    private final ChatRoomRepository chatRoomRepository;

    public List<GameRoomParticipantEntity> findByRoomId(String topicId) {
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(topicId);

        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();
            Optional<List<GameRoomParticipantEntity>> list = gameRoomParticipantRepository.findByRoomId(roomId);
            if (list.isPresent()) {
                return list.get();
            }
        }

        return null;
    }

    public GameRoomParticipantEntity findById(Long roomId, Long userId) {

        GameRoomParticipantId id = new GameRoomParticipantId(roomId, userId);
        return gameRoomParticipantRepository.findParticipantByGameRoomParticipantId(id);
    }


    @Transactional
    public void updateParticipant(GameRoomParticipantEntity gameRoomParticipantEntity) {

        gameRoomParticipantEntity.setCorrectCount(gameRoomParticipantEntity.getCorrectCount() + 1);
    }

    public List<GameRoomParticipantEntity> findParticipantByRoomIdOrderByCorrectCount(Long roomId) {

        return gameRoomParticipantRepository.findByRoomIdOrderByCorrectCount(roomId);
    }
}
