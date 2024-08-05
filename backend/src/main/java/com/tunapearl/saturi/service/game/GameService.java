package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.*;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.game.GameTipRepository;
import com.tunapearl.saturi.repository.redis.TopicRepository;
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
    private final TopicRepository topicRepository;

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
        ChatRoom topic;

        if (findRooms.isPresent()) {

            gameRoomEntity = findRooms.get().get(0);

        }else{
            //방 생성
            gameRoomEntity = new GameRoomEntity();
            gameRoomEntity.setStatus(Status.MATCHING);
            gameRoomEntity.setLocation(locationRepository.findById(gameMatchingRequestDTO.getLocationId()).orElseThrow());

            //Topic생성해서 redis에 저장
            topic= ChatRoom.create();
            log.info("created topicId : {}",topic.getRoomId());

            gameRoomEntity.setTopicId(topic.getRoomId());
            gameRoomEntity = gameRoomRepository.saveGameRoom(gameRoomEntity);
            topicRepository.save(topic);
        }

        UserEntity user = userRepository.findByUserId(gameMatchingRequestDTO.getUserId()).orElseThrow();
        GameRoomParticipantEntity gameRoomParticipantEntity = new GameRoomParticipantEntity(gameRoomEntity, user);
        gameRoomParticipantRepository.saveGameRoomParticipant(gameRoomParticipantEntity);

        List<GameRoomParticipantEntity> participants = gameRoomParticipantRepository.findByRoomId(gameRoomEntity.getRoomId());

        if (participants.size() == 5) {
            gameRoomEntity.setStatus(Status.IN_PROGRESS);
            gameRoomRepository.updateGameRoom(gameRoomEntity);
        }

        //게임방토픽Id 넘겨주자
        GameMatchingResponseDTO responseDTO = new GameMatchingResponseDTO();
        responseDTO.setRoomId(gameRoomEntity.getTopicId());
        return responseDTO;
    }
}
