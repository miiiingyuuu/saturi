package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import com.tunapearl.saturi.domain.game.GameRoomParticipantId;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameRoomParticipantService {

    private final GameRoomParticipantRepository gameRoomParticipantRepository;

    public GameRoomParticipantEntity findById(Long roomId,Long userId) {

        GameRoomParticipantId id=new GameRoomParticipantId(roomId,userId);
        return gameRoomParticipantRepository.findParticipantByGameRoomParticipantId(id);
    }


    @Transactional
    public void updateParticipant(GameRoomParticipantEntity gameRoomParticipantEntity){

        gameRoomParticipantEntity.setCorrectCount(gameRoomParticipantEntity.getCorrectCount()+1);
    }
}
