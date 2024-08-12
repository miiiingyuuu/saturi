package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.lesson.LessonClaimEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
import com.tunapearl.saturi.domain.lesson.LessonResultEntity;
import com.tunapearl.saturi.domain.user.Role;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.UserBanRequestDTO;
import com.tunapearl.saturi.dto.admin.claim.ClaimDeleteRequestDto;
import com.tunapearl.saturi.dto.admin.statistics.*;
import com.tunapearl.saturi.dto.user.UserMsgResponseDTO;
import com.tunapearl.saturi.repository.LocationRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import com.tunapearl.saturi.service.ChatClaimService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final GameRoomRepository gameRoomRepository;
    private final ChatClaimService chatClaimService;
    private final LocationRepository locationRepository;
    private static final int LESSON_MAX_SIZE = 20;

    public UserMsgResponseDTO banUser(UserBanRequestDTO request) {
        UserEntity findUser = userRepository.findByUserId(request.getUserId()).get();
        findUser.setRole(Role.BANNED);
        LocalDateTime returnDt = LocalDateTime.now().plusDays(request.getBanDate());
        findUser.setReturnDt(returnDt);
        chatClaimService.updateClaim(new ClaimDeleteRequestDto(request.getChatClaimId()));
        return new UserMsgResponseDTO("ok");
    }

    public List<UserEntity> getAllUsersSortedByExp() {
        return userRepository.findAllSortedByExp().orElse(null);
    }

    public List<LessonGroupEntity> findLessonGroupByLocationId(Long locationId) {
        return lessonRepository.findLessonGroupByLocationId(locationId).orElse(null);
    }

    public List<LessonGroupResultEntity> findLessonGroupResultByLessonGroupId(List<Long> lessonGroupIds) {
        return lessonRepository.findLessonGroupResultByLessonGroupId(lessonGroupIds).orElse(null);
    }

    public List<LessonGroupResultEntity> findAllLessonGroupResult() {
        return lessonRepository.findAllLessonGroupResult().orElse(null);
    }

    public UserLocationResponseDTO getUserLocationStatistics() {
        List<LocationEntity> locations = locationRepository.findAll().orElse(null);
        if(locations == null) throw new IllegalStateException("지역 정보가 존재하지 않습니다.");
        int locationNum = locations.size();

        List<UserEntity> users = userRepository.findAllExceptAdmin().orElse(null);
        if(users == null) throw new IllegalStateException("회원이 존재하지 않습니다.");

        int[] userNums = new int[locationNum + 1]; // not zero index
        for (UserEntity user : users) {
            int locationInd = user.getLocation().getLocationId().intValue();
            userNums[locationInd]++;
        }
        List<LocationIdAndUserNumDTO> absoluteValue = new ArrayList<>();
        for(int i = 1; i < locationNum + 1; i++) {
            LocationIdAndUserNumDTO locationIdAndUserNum = new LocationIdAndUserNumDTO((long)i, (long)userNums[i]);
            absoluteValue.add(locationIdAndUserNum);
        }

        List<LocationIdAndUserNumDTO> relativeValue = new ArrayList<>();
        int userNum = users.size();
        for(int i = 1; i < locationNum + 1; i++) {
            LocationIdAndUserNumDTO locationIdAndUserNum = new LocationIdAndUserNumDTO((long)i, (long)userNums[i] * 100 / userNum);
            relativeValue.add(locationIdAndUserNum);
        }

        return new UserLocationResponseDTO(absoluteValue, relativeValue);
    }

    public List<AvgSimilarityAndAccuracyByLocationIdResponseDTO> getAvgSimilarityStatistics() {
        List<AvgSimilarityAndAccuracyByLocationIdResponseDTO> result = new ArrayList<>();

        List<LocationEntity> locations = locationRepository.findAll().orElse(null);
        if(locations == null) throw new IllegalStateException("지역 정보가 존재하지 않습니다.");

        // 전체 레슨그룹결과 조회
        List<LessonGroupResultEntity> lessonGroupResults = lessonRepository.findAllLessonGroupResult().orElse(null);
        if(lessonGroupResults == null) throw new IllegalStateException("학습 결과가 존재하지 않습니다.");

        // key: locationId, value = LessonGroupResult
        Map<Long, List<LessonGroupResultEntity>> lessonGroupResultMap = new HashMap<>();

        // 지역 아이디 별로 레슨그룹결과 모으기
        for (LessonGroupResultEntity lgr : lessonGroupResults) {
            Long locationId = lgr.getLessonGroup().getLocation().getLocationId();
            if(lessonGroupResultMap.containsKey(locationId)) {
                lessonGroupResultMap.get(locationId).add(lgr);
            } else {
                lessonGroupResultMap.put(locationId, new ArrayList<>());
                lessonGroupResultMap.get(locationId).add(lgr);
            }
        }

        // 한 지역씩 돌면서 score 저장
        for (Long locationId : lessonGroupResultMap.keySet()) {
            List<LessonGroupResultEntity> lessonGroupResultsByLocation = lessonGroupResultMap.get(locationId);
            Long sumSimilarity = 0L;
            Long sumAccuracy = 0L;
            for (LessonGroupResultEntity lgr : lessonGroupResultsByLocation) {
                if(lgr.getAvgAccuracy() == null || lgr.getAvgSimilarity() == null) continue;
                sumSimilarity += lgr.getAvgSimilarity();
                sumAccuracy += lgr.getAvgAccuracy();
            }
            Long avgSimilarity = sumSimilarity / lessonGroupResultsByLocation.size();
            Long avgAccuracy = sumAccuracy / lessonGroupResultsByLocation.size();

            AvgSimilarityAndAccuracyByLocationIdResponseDTO avg = new AvgSimilarityAndAccuracyByLocationIdResponseDTO(locationId, avgSimilarity, avgAccuracy);
            result.add(avg);
        }

        return result;
    }

    public LessonAndGameRateResponseDTO getContentRatioStatistic() {
        // 레슨 그룹 결과 테이블 로우 개수
        List<LessonGroupResultEntity> lessonGroupResults = lessonRepository.findAllLessonGroupResult().orElse(null);
        if(lessonGroupResults == null) throw new IllegalStateException("학습 결과가 존재하지 않습니다.");

        Long lessonRate = 0L;
        lessonRate = (long)lessonGroupResults.size();

        // 게임방 테이블 로우 개수 * 5 (5명 참가)
        Long gameRate = 0L;
        List<GameRoomEntity> gameRooms = gameRoomRepository.findAllGameRoom().orElse(null);
        if(gameRooms == null) throw new IllegalStateException("게임 결과가 존재하지 않습니다.");
        gameRate = gameRooms.size() * 5L;

        Long total = lessonRate + gameRate;
        lessonRate = lessonRate * 100 / total;
        gameRate = gameRate * 100 / total;
        // 100 맞추기
        lessonRate = lessonRate + (100 - (lessonRate + gameRate));

        return new LessonAndGameRateResponseDTO(lessonRate, gameRate);
    }

    public LessonStatisticsResponseDTO getLessonStatistics() {
        // 모든 레슨 결과 조회
        List<LessonResultEntity> lessonResults = lessonRepository.findAllLessonResult().orElse(null);
        if(lessonResults == null) throw new IllegalStateException("학습 결과가 존재하지 않습니다.");

        // 레슨별 완료 횟수
        List<LessonIdAndValueDTO> sortedByCompletedNum = new ArrayList<>();

        Map<Long, Long> lessonCompletedNumMap = new HashMap<>(); // key: lessonId, value = 완료 횟수
        for (LessonResultEntity lr : lessonResults) {
            Long lessonId = lr.getLesson().getLessonId();
            lessonCompletedNumMap.put(lessonId, lessonCompletedNumMap.getOrDefault(lessonId, 0L) + 1);
        }
        for (Long l : lessonCompletedNumMap.keySet()) {
            sortedByCompletedNum.add(new LessonIdAndValueDTO(l, lessonCompletedNumMap.get(l)));
        }
        sortedByCompletedNum.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
        if(sortedByCompletedNum.size() > LESSON_MAX_SIZE) sortedByCompletedNum = sortedByCompletedNum.subList(0, LESSON_MAX_SIZE);


        // 레슨별 평균 파형 유사도
        List<LessonIdAndValueDTO> sortedByAvgSimilarity = new ArrayList<>();
        Map<Long, Long> lessonSimilarityMap = new HashMap<>();
        for (LessonResultEntity lr : lessonResults) {
            Long lessonId = lr.getLesson().getLessonId();
            Long accentSimilarity = 0L;
            if(lr.getAccentSimilarity() != null) accentSimilarity = lr.getAccentSimilarity();
            lessonSimilarityMap.put(lessonId, lessonSimilarityMap.getOrDefault(lessonId, 0L) + accentSimilarity);
        }
        for (Long l : lessonSimilarityMap.keySet()) {
            sortedByAvgSimilarity.add(new LessonIdAndValueDTO(l, lessonSimilarityMap.get(l) / lessonCompletedNumMap.get(l)));
        }
        sortedByAvgSimilarity.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
        if(sortedByAvgSimilarity.size() > LESSON_MAX_SIZE) sortedByAvgSimilarity = sortedByAvgSimilarity.subList(0, LESSON_MAX_SIZE);

        // 레슨별 평균 발음 정확도
        List<LessonIdAndValueDTO> sortedByAvgAccuracy = new ArrayList<>();
        Map<Long, Long> lessonAccuracyMap = new HashMap<>();
        for (LessonResultEntity lr : lessonResults) {
            Long lessonId = lr.getLesson().getLessonId();
            Long pronunciationAccuracy = 0L;
            if(lr.getPronunciationAccuracy() != null) pronunciationAccuracy = lr.getPronunciationAccuracy();
            lessonAccuracyMap.put(lessonId, lessonAccuracyMap.getOrDefault(lessonId, 0L) + pronunciationAccuracy);
        }
        for (Long l : lessonAccuracyMap.keySet()) {
            sortedByAvgAccuracy.add(new LessonIdAndValueDTO(l, lessonAccuracyMap.get(l) / lessonCompletedNumMap.get(l)));
        }
        sortedByAvgAccuracy.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
        if(sortedByAvgAccuracy.size() > LESSON_MAX_SIZE) sortedByAvgAccuracy = sortedByAvgSimilarity.subList(0, LESSON_MAX_SIZE);

        // 레슨별 신고횟수
        List<LessonIdAndValueDTO> sortedByClaimNum = new ArrayList<>();
        List<LessonClaimEntity> lessonClaims = lessonRepository.findAllLessonClaim().orElse(null);
        if(lessonClaims != null) {
            Map<Long, Long> lessonClaimMap = new HashMap<>();
            for (LessonClaimEntity lc : lessonClaims) {
                Long lessonId = lc.getLesson().getLessonId();
                lessonClaimMap.put(lessonId, lessonClaimMap.getOrDefault(lessonId, 0L) + 1);
            }
            for (Long l : lessonClaimMap.keySet()) {
                sortedByClaimNum.add(new LessonIdAndValueDTO(l, lessonClaimMap.get(l)));
            }
            sortedByClaimNum.sort(Comparator.comparing(LessonIdAndValueDTO::getValue).reversed());
            if(sortedByClaimNum.size() > LESSON_MAX_SIZE) sortedByClaimNum = sortedByClaimNum.subList(0, LESSON_MAX_SIZE);
        }

        return new LessonStatisticsResponseDTO(sortedByCompletedNum, sortedByAvgSimilarity, sortedByAvgAccuracy, sortedByClaimNum);
    }
}
