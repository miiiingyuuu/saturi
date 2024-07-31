package com.tunapearl.saturi.service;

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
     * 게임 매칭
     */
    public GameMatchingResponseDTO matching(GameMatchingRequestDTO gameMatchingRequestDTO) {

        //TODO:locationId, status로 가져오기
        Optional<List<GameRoomEntity>> findUsers = gameRoomRepository.findByStatus(Status.MATCHING);
        if (findUsers.isPresent()) {

            log.info("방 이따");
            GameRoomEntity gameRoomEntity = findUsers.get().get(0);
            GameRoomParticipantEntity gameRoomParticipantEntity=new GameRoomParticipantEntity();
            gameRoomParticipantEntity.setGameRoom(gameRoomEntity);
            gameRoomParticipantEntity.setUser(userRepository.findByUserId(gameMatchingRequestDTO.getUserId()).get());

            gameRoomParticipantRepository.saveGameRoomParticipant(gameRoomParticipantEntity);
        }else{
            //방 생성
            GameRoomEntity gameRoomEntity = new GameRoomEntity();
            gameRoomEntity.setStatus(Status.MATCHING);
            gameRoomEntity.setLocation(locationRepository.findById(gameMatchingRequestDTO.getLocationId()).get());
//            gameRoomRepository.saveGameRoom(gameRoomEntity);
            log.info("room created {}",gameRoomRepository.saveGameRoom(gameRoomEntity));
        }
        return null;
    }
}
