package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import com.tunapearl.saturi.domain.game.GameTipEntity;
import com.tunapearl.saturi.domain.game.Status;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.game.GameTipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class GameService {

    private final GameTipRepository gameTipRepository;
    private final GameRoomRepository gameRoomRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final GameRoomParticipantRepository gameRoomParticipantRepository;

    /**
     * 팁 추가
     */
    @Transactional
    public void registTip(String content) {
        GameTipEntity gametip = new GameTipEntity();
        gametip.setContent(content);
        gameTipRepository.saveTip(gametip);
    }

    /**
     * 팁 조회
     */
    @Transactional
    public List<GameTipEntity> getTip() {

        return gameTipRepository.getTip().get();
    }

    /**
     * 게임 매칭,
     * 도중에 매칭취소한다면 participant에서 삭제할 것
     */
    public GameMatchingResponseDTO matching(GameMatchingRequestDTO gameMatchingRequestDTO) {

        LocationEntity location=locationRepository.findById(gameMatchingRequestDTO.getLocationId()).orElseThrow();
        Optional<List<GameRoomEntity>> findRooms = gameRoomRepository.findByLocationAndStatus(location,Status.MATCHING);
        GameRoomEntity gameRoomEntity;

        if (findRooms.isPresent()) {

            gameRoomEntity = findRooms.get().get(0);

        }else{
            //방 생성
            gameRoomEntity = new GameRoomEntity();
            gameRoomEntity.setStatus(Status.MATCHING);
            gameRoomEntity.setLocation(locationRepository.findById(gameMatchingRequestDTO.getLocationId()).orElseThrow());
            gameRoomEntity = gameRoomRepository.saveGameRoom(gameRoomEntity);
        }

        //채팅방 매칭완료 4명 이하면 참여자로 넣어야햄,,,
        //5명이 되면 넣으면서 gameRoom status=inProgress..?로
        UserEntity user = userRepository.findByUserId(gameMatchingRequestDTO.getUserId()).orElseThrow();
        GameRoomParticipantEntity gameRoomParticipantEntity = new GameRoomParticipantEntity(gameRoomEntity, user);
        gameRoomParticipantRepository.saveGameRoomParticipant(gameRoomParticipantEntity);

        List<GameRoomParticipantEntity> participants = gameRoomParticipantRepository.findByRoomId(gameRoomEntity.getRoomId());

        if (participants.size() == 5) {
            gameRoomEntity.setStatus(Status.IN_PROGRESS);
            gameRoomRepository.updateGameRoom(gameRoomEntity);
        }

        //채팅방Id 넘겨주자
        return null;
    }
}
