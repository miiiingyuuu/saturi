package com.tunapearl.saturi.service.game;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.*;
import com.tunapearl.saturi.domain.game.room.ChatRoom;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.dto.game.GameResultRequestDTO;
import com.tunapearl.saturi.dto.game.GameResultResponseDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameRoomParticipantRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.game.GameTipRepository;
import com.tunapearl.saturi.repository.redis.ChatRoomRepository;
import com.tunapearl.saturi.service.GameRoomParticipantService;
import com.tunapearl.saturi.service.GameRoomQuizService;
import com.tunapearl.saturi.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final ChatRoomRepository chatRoomRepository;
    private final GameRoomQuizService gameRoomQuizService;
    private final QuizService quizService;
    private final GameRoomParticipantService gameRoomParticipantService;

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

        LocationEntity location = locationRepository.findById(gameMatchingRequestDTO.getLocationId()).orElseThrow();
        Optional<List<GameRoomEntity>> findRooms = gameRoomRepository.findByLocationAndStatus(location, Status.MATCHING);
        GameRoomEntity gameRoomEntity;
        ChatRoom topic;

        if (findRooms.isPresent()) {

            gameRoomEntity = findRooms.get().get(0);

        } else {
            //방 생성
            gameRoomEntity = new GameRoomEntity();
            gameRoomEntity.setStatus(Status.MATCHING);
            gameRoomEntity.setLocation(locationRepository.findById(gameMatchingRequestDTO.getLocationId()).orElseThrow());


            //Topic생성해서 redis에 저장
            topic = ChatRoom.create();
            log.info("created roomId : {}", topic.getRoomId());

            gameRoomEntity.setTopicId(topic.getTopicId());
            gameRoomEntity = gameRoomRepository.saveGameRoom(gameRoomEntity);

            long roomId = gameRoomEntity.getRoomId();
            topic.setRoomId(roomId);

            //방 생성과 동시에 문제 10개 랜덤 추출 및 저장 요청
            chatRoomRepository.save(topic);
            gameRoomQuizService.saveTenRandomQuiz(roomId, quizService.findRandomIdByLocation(gameMatchingRequestDTO.getLocationId()));
        }

        UserEntity user = userRepository.findByUserId(gameMatchingRequestDTO.getUserId()).orElseThrow();
        GameRoomParticipantEntity gameRoomParticipantEntity = new GameRoomParticipantEntity(gameRoomEntity, user);
        gameRoomParticipantRepository.saveGameRoomParticipant(gameRoomParticipantEntity);

        Optional<List<GameRoomParticipantEntity>> Optionalparticipants = gameRoomParticipantRepository.findByRoomId(gameRoomEntity.getRoomId());
        if (Optionalparticipants.isPresent()) {
            List<GameRoomParticipantEntity> participants = Optionalparticipants.get();
            if (participants.size() == 5) {
                gameRoomEntity.setStatus(Status.IN_PROGRESS);
                gameRoomEntity.setStartDt(LocalDateTime.now());
            }
        }

        //게임방토픽Id 넘겨주자
        GameMatchingResponseDTO responseDTO = new GameMatchingResponseDTO();
        responseDTO.setRoomId(gameRoomEntity.getTopicId());
        return responseDTO;
    }

    /**
     * 게임 퇴장
     */
    public void changeParticipantStatus(GameRoomParticipantId id){
        //게임 탈주
        GameRoomParticipantEntity gameRoomParticipantEntity=gameRoomParticipantRepository.findParticipantByGameRoomParticipantId(id);
        gameRoomParticipantEntity.setExited(true);
    }

    public List<GameResultResponseDTO> getGameResult(GameResultRequestDTO requestDto) {

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(requestDto.getRoomId());
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            List<GameRoomParticipantEntity> participants = gameRoomParticipantService.findParticipantByRoomIdOrderByCorrectCount(roomId);
            List<GameResultResponseDTO> resultList = new ArrayList<>();

            for (GameRoomParticipantEntity participant : participants)
            {
                GameResultResponseDTO resultDTO = new GameResultResponseDTO();
                resultDTO.setRank(participant.getMatchRank());
                UserEntity user = participant.getUser();
                resultDTO.setNickName(user.getNickname());

                if (user.getUserId() == requestDto.getUserId()) {//본인임
                    resultDTO.setUser(true);
                }

                resultDTO.setExp(participant.getBeforeExp());
                int count=participant.getCorrectCount();
                resultDTO.setAnsCount(count);
                resultDTO.setEarnedExp(count * 2);//개당 2exp임

                resultList.add(resultDTO);
            }

            return resultList;
        }
        return null;
    }
}
