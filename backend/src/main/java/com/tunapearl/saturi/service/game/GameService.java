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
     * 게임 매칭
     */
    public GameMatchingResponseDTO matching(GameMatchingRequestDTO gameMatchingRequestDTO) {

        LocationEntity location = locationRepository.findById(gameMatchingRequestDTO.getLocationId()).orElseThrow();
        Optional<List<GameRoomEntity>> findRooms = gameRoomRepository.findByLocationAndStatus(location, Status.MATCHING);
        GameRoomEntity gameRoomEntity = new GameRoomEntity();
        UserEntity user = userRepository.findByUserId(gameMatchingRequestDTO.getUserId()).orElseThrow();

        //TODO: 한사람이 자주 매칭 시도하면 막아야함
        if (findRooms.isPresent()) {
            List<GameRoomEntity> rooms = findRooms.get();
            boolean isRoom=true;
            for (GameRoomEntity room : rooms) {

                isRoom = true;
                //방마다 참여자 보고 내가 없다면 그 방에 날 넣는다, 끝까지 못 넣었으면 방을 만들어야함
                List<GameRoomParticipantEntity> participantList = gameRoomParticipantRepository.findByRoomId(room.getRoomId()).orElseThrow();
                for (GameRoomParticipantEntity participant : participantList) {
                    if (participant.getUser().getUserId() == user.getUserId()) {
                        //이미 그 방에 내가 매칭되어 있다는 말
                        isRoom = false;
                        break;//다음 방으로
                    }
                }
                if (isRoom) {
                    //내가 없다는 말==매칭
                    gameRoomEntity = room;
                    break;
                }
            }
            if (!isRoom) {
                //들어갈 방이 없다는 말
                gameRoomEntity = createGameRoom(gameMatchingRequestDTO.getLocationId());
            }

        } else {
            //방이 없다
            gameRoomEntity = createGameRoom(gameMatchingRequestDTO.getLocationId());
        }


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
     * 방 생성
     */
    public GameRoomEntity createGameRoom(long locationId) {
        //방 생성
        ChatRoom topic;

        GameRoomEntity gameRoomEntity = new GameRoomEntity();
        gameRoomEntity.setStatus(Status.MATCHING);
        gameRoomEntity.setLocation(locationRepository.findById(locationId).orElseThrow());


        //Topic생성해서 redis에 저장
        topic = ChatRoom.create();
        log.info("created roomId : {}", topic.getRoomId());

        gameRoomEntity.setTopicId(topic.getTopicId());
        gameRoomEntity = gameRoomRepository.saveGameRoom(gameRoomEntity);

        long roomId = gameRoomEntity.getRoomId();
        topic.setRoomId(roomId);

        //방 생성과 동시에 문제 10개 랜덤 추출 및 저장 요청
        chatRoomRepository.save(topic);
        gameRoomQuizService.saveTenRandomQuiz(roomId, quizService.findRandomIdByLocation(locationId));

        return gameRoomEntity;
    }

    /**
     * 게임 퇴장
     */
    public void changeParticipantStatus(GameRoomParticipantId id) {
        //게임 탈주
        GameRoomParticipantEntity gameRoomParticipantEntity = gameRoomParticipantRepository.findParticipantByGameRoomParticipantId(id);
        gameRoomParticipantEntity.setExited(true);
    }

    public List<GameResultResponseDTO> getGameResult(GameResultRequestDTO requestDto) {

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(requestDto.getRoomId());
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            long roomId = chatRoom.getRoomId();

            List<GameRoomParticipantEntity> participants = gameRoomParticipantService.findParticipantByRoomIdOrderByCorrectCount(roomId);
            List<GameResultResponseDTO> resultList = new ArrayList<>();

            for (GameRoomParticipantEntity participant : participants) {
                GameResultResponseDTO resultDTO = new GameResultResponseDTO();
                resultDTO.setRank(participant.getMatchRank());
                UserEntity user = participant.getUser();
                resultDTO.setNickName(user.getNickname());
                resultDTO.setBirdId(user.getBird().getId());

                if (user.getUserId() == requestDto.getUserId()) {//본인임
                    resultDTO.setUser(true);
                }

                resultDTO.setExp(participant.getBeforeExp());
                int count = participant.getCorrectCount();
                resultDTO.setAnsCount(count);
                resultDTO.setEarnedExp(count * 2);//개당 2exp임

                resultList.add(resultDTO);
            }

            return resultList;
        }
        return null;
    }
}
