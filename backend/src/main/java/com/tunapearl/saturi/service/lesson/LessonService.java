package com.tunapearl.saturi.service.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.*;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.lesson.*;
import com.tunapearl.saturi.dto.user.UserExpInfoCurExpAndEarnExp;
import com.tunapearl.saturi.exception.AlreadyMaxSizeException;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import com.tunapearl.saturi.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public LessonCategoryEntity findByIdLessonCategory(Long lessonCategoryId) {
        return lessonRepository.findByIdLessonCategory(lessonCategoryId).orElse(null);
    }

    public List<LessonCategoryEntity> findAllLessonCategory() {
        return lessonRepository.findAllLessonCategory().orElse(null);
    }

    public LessonGroupEntity findByIdLessonGroup(Long lessonGroupId) {
        return lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);
    }

    public List<LessonGroupEntity> findAllLessonGroup() {
        return lessonRepository.findAllLessonGroup().orElse(null);
    }

    public void updateLesson(Long lessonId, Long lessonGroupId, String script, String filePath) {
        List<LessonEntity> allByLessonGroupId = findAllByLessonGroupId(lessonGroupId);
        if(allByLessonGroupId.size() >= 5) {
            throw new AlreadyMaxSizeException();
        }
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);
        LessonGroupEntity findLessonGroup = lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);
        lesson.setLessonGroup(findLessonGroup);
        lesson.setScript(script);
        lesson.setSampleVoicePath(filePath);
        lesson.setLastUpdateDt(LocalDateTime.now());
    }

    public void deleteLesson(Long lessonId) {
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);
        findLesson.setLessonGroup(null);
        findLesson.setIsDeleted(true);
        findLesson.setLastUpdateDt(LocalDateTime.now());
    }

    public List<LessonGroupEntity> findLessonGroupByLocationAndCategory(Long locationId, Long categoryId) {
        return lessonRepository.findLessonGroupByLocationAndCategory(locationId, categoryId).orElse(null);
    }

    public LessonEntity findById(Long lessonId) {
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);
        if(findLesson == null) throw new IllegalArgumentException("존재하지 않는 레슨입니다.");
        return findLesson;
    }

    public Long getProgressByUserIdLocationAndCategory(Long userId, Long locationId, Long lessonCategoryId) {
        int completedLessonGroupCnt = 0;
        // 유저 아이디로 그룹 결과 조회(완료된거만)
        List<LessonGroupResultEntity> lessonGroupResult = lessonRepository.findLessonGroupResultByUserId(userId).orElse(null);
        if(lessonGroupResult == null) return 0L;
        // 조회된 그룹 결과를 그룹 아이디로 조회하며 지역과 대화유형이 맞는 개수를 셈
        for (LessonGroupResultEntity lgResult : lessonGroupResult) {
            LocationEntity location = lgResult.getLessonGroup().getLocation();
            LessonCategoryEntity lessonCategory = lgResult.getLessonGroup().getLessonCategory();
            if(location.getLocationId().equals(locationId) && lessonCategory.getLessonCategoryId().equals(lessonCategoryId)) {
                completedLessonGroupCnt++;
            }
        }
        // 그 개수 / 9 해서 진척도 리턴
        return (completedLessonGroupCnt * 100) / 9L;
    }

    public List<LessonGroupProgressByUserDTO> getLessonGroupProgressAndAvgAccuracy(Long userId, Long locationId, Long lessonCategoryId) {
        // lessonGroup 완성 여부에 상관없이 lessonGroupResult 받아오기
        List<LessonGroupResultEntity> lessonGroupResult = lessonRepository.findLessonGroupResultByUserIdWithoutIsCompleted(userId).orElse(null);
        List<LessonGroupProgressByUserDTO> result = new ArrayList<>();
        if(lessonGroupResult == null) return result;
        for (LessonGroupResultEntity lgResult : lessonGroupResult) {
            // lessonGroupId
            Long lessonGroupId = lgResult.getLessonGroup().getLessonGroupId();
            // groupProgress
            Long lessonGroupResultId = lgResult.getLessonGroupResultId();
            List<LessonResultEntity> lessonResults = lessonRepository.findLessonResultByLessonGroupResultId(lessonGroupResultId).orElse(null);
            Long groupProcess = (lessonResults.size() * 100) / 5L;
            // avgAccuracy
            Long avgAccuracy = (lgResult.getAvgAccuracy() + lgResult.getAvgSimilarity()) / 2L;

            LessonGroupProgressByUserDTO dto = new LessonGroupProgressByUserDTO(lessonGroupId, lgResult.getLessonGroup().getName(), groupProcess, avgAccuracy);
            result.add(dto);
        }
        return result;
    }

    public Long skipLesson(Long userId, Long lessonId) {
        // 레슨아이디로 레슨그룹 아이디를 찾는다
        LessonEntity findLesson = lessonRepository.findById(lessonId).orElse(null);
        Long lessonGroupId = findLesson.getLessonGroup().getLessonGroupId();

        // 유저아이디와 레슨그룹 아이디로 레슨그룹결과 아이디를 찾는다.
        List<LessonGroupResultEntity> lessonGroupResults = lessonRepository.findLessonGroupResultByUserIdWithoutIsCompleted(userId).orElse(null);
        Long lessonGroupResultId = findLessonGroupResultId(lessonGroupResults, lessonGroupId);
        log.info("너 널이지 {}", lessonGroupResultId);
        // 레슨아이디와 레슨그룹결과아이디로 레슨결과를 생성한다. 이 때 isSkipped만 true로 해서 생성한다. (add) 학습 시간도 초기화
        // 이미 학습했던 레슨이면 제일 최근에 학습한 레슨결과아이디 반환(건너뛰기 일때는 크게 레슨결과아이디가 필요하지 않아서 우선 제일 최근 레슨결과아이디 반환)
        Optional<List<LessonResultEntity>> lessonResultsOpt = lessonRepository.findLessonResultByLessonIdAndLessonGroupResultId(lessonId, lessonGroupResultId);
        if(lessonResultsOpt.isPresent()) {
            // 이미 레슨결과가 존재
            List<LessonResultEntity> lessonResults = lessonResultsOpt.orElse(null);
            lessonResults.sort(Comparator.comparing(LessonResultEntity::getLessonDt).reversed());
            return lessonResults.get(0).getLessonResultId();
        }
        LessonResultEntity lessonResultSkipped = new LessonResultEntity();
        LessonGroupResultEntity lessonGroupResult = lessonRepository.findLessonGroupResultById(lessonGroupResultId).orElse(null);
        lessonResultSkipped.setIsSkipped(true);
        lessonResultSkipped.setLesson(findLesson);
        lessonResultSkipped.setLessonDt(LocalDateTime.now());
        lessonResultSkipped.setLessonGroupResult(lessonGroupResult);

        // 생성한 레슨결과를 저장하고 레슨결과아이디를 리턴한다.
        return lessonRepository.saveLessonForSkipped(lessonResultSkipped).orElse(null);
    }

    public Long createLessonGroupResult(Long userId, Long lessonGroupId) {
        // userId로 유저 객체 찾기
        UserEntity findUser = userRepository.findByUserId(userId).orElse(null);
        // lessonGroupId로 레슨 그룹 객체 찾기
        LessonGroupEntity findLessonGroup = lessonRepository.findByIdLessonGroup(lessonGroupId).orElse(null);

        // 이미 레슨그룹결과가 있는지 확인
        Optional<List<LessonGroupResultEntity>> getLessonGroupResult = lessonRepository.findLessonGroupResultByUserIdAndLessonGroupId(userId, lessonGroupId);
        if(getLessonGroupResult.isPresent()) {
            getLessonGroupResult.get().get(0).setStartDt(LocalDateTime.now()); // 복습이면 시간 현재로 갱신
            return getLessonGroupResult.get().get(0).getLessonGroupResultId();
        }

        // 유저, 레슨그룹, 레슨 그룹 시작 일시 설정, 완료 여부 false
        LessonGroupResultEntity lessonGroupResult = createLessonGroupResult(findUser, findLessonGroup);
        return lessonRepository.createLessonGroupResult(lessonGroupResult).orElse(null);
    }

    private static LessonGroupResultEntity createLessonGroupResult(UserEntity findUser, LessonGroupEntity findLessonGroup) {
        LessonGroupResultEntity lessonGroupResult = new LessonGroupResultEntity();
        lessonGroupResult.setUser(findUser);
        lessonGroupResult.setLessonGroup(findLessonGroup);
        lessonGroupResult.setStartDt(LocalDateTime.now());
        lessonGroupResult.setIsCompleted(false);
        return lessonGroupResult;
    }

    public Optional<LessonInfoDTO> getLessonInfoForUser(Long userId, Long lessonId) {
        // 레슨 아이디로 레슨 조회해서 레슨 그룹 아이디 조회
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);
        Long lessonGroupId = lesson.getLessonGroup().getLessonGroupId();

        // 유저 아이디와 레슨 그룹 아이디로 레슨 그룹 결과 조회
        Optional<List<LessonGroupResultEntity>> lessonGroupResults = lessonRepository.findLessonGroupResultByUserIdWithoutIsCompleted(userId);
        if(lessonGroupResults.isEmpty()) return Optional.empty();
        // FIXME lessonGroupId를 넣어야함
        Long lessonGroupResultId = findLessonGroupResultId(lessonGroupResults.get(), lessonGroupId);
        for (LessonGroupResultEntity lr : lessonGroupResults.get()) {
            log.info("lr = {}. {}", lr.getLessonGroup().getLessonGroupId(), lr.getLessonGroup().getName());
        }

        // 레슨 아이디랑 레슨 그룹 결과 아이디로 레슨 결과 조회
        Optional<List<LessonResultEntity>> lessonResults = lessonRepository.findLessonResultByLessonIdAndLessonGroupResultId(lessonId, lessonGroupResultId);

        // 결과가 없으면 null 반환
        if(lessonResults.isEmpty()) return Optional.empty();

        // 평균 정확도가 높은 순으로 정렬
        Collections.sort(lessonResults.orElse(null), (o1, o2) -> Long.compare((o2.getAccentSimilarity() + o2.getPronunciationAccuracy()) / 2,
                                                                                    (o1.getAccentSimilarity() + o1.getPronunciationAccuracy()) / 2));
        // 평균 정확도가 높은 레슨결과를 가져옴
        LessonResultEntity lessonResult = lessonResults.orElse(null).get(0);

        // 결과가 있는데 건너뛰기 한거면 건너뛰기로 데이터 반환
        if(lessonResult.getIsSkipped()) {
            return Optional.ofNullable(new LessonInfoDTO(true, null, null));
        }
        return Optional.ofNullable(new LessonInfoDTO(false, lessonResult.getAccentSimilarity(), lessonResult.getPronunciationAccuracy()));
    }

    private Long findLessonGroupResultId(List<LessonGroupResultEntity> lessonGroupResults, Long lessonId) {
        for (LessonGroupResultEntity lgr : lessonGroupResults) {
            if(lgr.getLessonGroup().getLessonGroupId().equals(lessonId)) return lgr.getLessonGroupResultId();
        }
        return null;
    }

    public Long saveLesson(LessonSaveRequestDTO request) {
        // 레슨 아이디로 레슨 객체 조회
        LessonEntity findLesson = lessonRepository.findById(request.getLessonId()).orElse(null);

        // 레슨그룹결과아이디로 레슨그룹결과 객체 조회
        LessonGroupResultEntity findLessonGroupResult = lessonRepository.findLessonGroupResultById(request.getLessonGroupResultId()).orElse(null);

        // LessonResultEntity 객체 생성
        LessonResultEntity lessonResult = createLessonResult(findLesson, findLessonGroupResult, request);

        // 녹음 파일 관련, 파형 관련 추가
        LessonRecordFileEntity lessonRecordFile = createLessonRecordFile(request, lessonResult);
        lessonRepository.saveLessonRecordFile(lessonRecordFile).orElse(null);
        LessonRecordGraphEntity lessonRecordGraph = createLessonRecordGraph(request, lessonResult);
        lessonRepository.saveLessonRecordGraph(lessonRecordGraph).orElse(null);

        Long lessonResultId = lessonRepository.saveLessonResult(lessonResult).orElse(null);
        return lessonResultId;
    }

    private LessonResultEntity createLessonResult(LessonEntity lesson, LessonGroupResultEntity lessonGroupResult, LessonSaveRequestDTO request) {
        LessonResultEntity lessonResult = new LessonResultEntity();
        lessonResult.setLesson(lesson);
        lessonResult.setLessonGroupResult(lessonGroupResult);
        lessonResult.setAccentSimilarity(request.getAccentSimilarity());
        lessonResult.setPronunciationAccuracy(request.getPronunciationAccuracy());
        lessonResult.setLessonDt(LocalDateTime.now());
        lessonResult.setIsSkipped(false);
        return lessonResult;
    }

    private LessonRecordFileEntity createLessonRecordFile(LessonSaveRequestDTO request, LessonResultEntity lessonResult) {
        LessonRecordFileEntity lessonRecordFile = new LessonRecordFileEntity();
        lessonRecordFile.setLessonResult(lessonResult);
        lessonRecordFile.setUserVoiceFileName(request.getFileName());
        lessonRecordFile.setUserVoiceFilePath(request.getFilePath());
        lessonRecordFile.setUserVoiceScript(request.getScript());
        return lessonRecordFile;
    }

    private LessonRecordGraphEntity createLessonRecordGraph(LessonSaveRequestDTO request, LessonResultEntity lessonResult) {
        LessonRecordGraphEntity lessonRecordGraph = new LessonRecordGraphEntity();
        lessonRecordGraph.setLessonResult(lessonResult);
        lessonRecordGraph.setGraphX(request.getGraphInfoX());
        lessonRecordGraph.setGraphY(request.getGraphInfoY());
        return lessonRecordGraph;
    }

    public Long saveClaim(Long userId, Long lessonId, String content) {
        LessonClaimEntity lessonClaim = new LessonClaimEntity();
        UserEntity user = userRepository.findByUserId(userId).orElse(null);
        LessonEntity lesson = lessonRepository.findById(lessonId).orElse(null);
        lessonClaim.setUser(user);
        lessonClaim.setLesson(lesson);
        lessonClaim.setContent(content);
        lessonClaim.setClaimDt(LocalDateTime.now());
        return lessonRepository.saveLessonClaim(lessonClaim).orElse(null);
    }

    public List<LessonClaimEntity> findAllLessonClaim() {
        List<LessonClaimEntity> lessonClaims = lessonRepository.findAllLessonClaim().orElse(null);
        log.info("lesson Claims {}", lessonClaims);
        return lessonClaims;
    }

    public List<LessonEntity> findAllByLessonGroupId(Long lessonGroupId) {
        return lessonRepository.findAllByLessonGroupId(lessonGroupId).orElse(null);

    }

    public LessonGroupResultSaveResponseDTO saveLessonGroupResult(Long userId, Long lessonGroupResultId) {
        // leesonGroupResult 조회
        LessonGroupResultEntity lessonGroupResult = lessonRepository.findLessonGroupResultById(lessonGroupResultId).orElse(null);
        if(lessonGroupResult == null) throw new IllegalArgumentException();
        LocalDateTime lessonGroupResultStartDt = lessonGroupResult.getStartDt();

        // 최근순으로 정렬된 레슨 결과 조회(건너뛰기 포함)
        Optional<List<LessonResultEntity>> lessonResultsOpt = lessonRepository.findLessonResultByLessonGroupResultIdSortedByRecentDt(lessonGroupResultId);
        if(lessonResultsOpt.isEmpty()) throw new IllegalArgumentException();
        List<LessonResultEntity> lessonResults = lessonResultsOpt.orElse(null);

        // 필요한 map
        Map<Long, LessonResultEntity> lessonResultMap = new HashMap<>(); // lessonId : LessonResult
        Map<Long, Long> expMap = new HashMap<>(); // lessonId : exp
        Map<Long, Long> maxSimilarityMap = new HashMap<>(); // lessonId : similarity
        Map<Long, Long> maxAccuracyMap = new HashMap<>(); // lessonId : accuracy
        Map<Long, PriorityQueue<LessonResultEntity>> pqMap = new HashMap<>(); // lessonId : PQ(LessonResultEntity) -> 사용할 때 pq 초기환 필요

        outer: for (LessonResultEntity lr : lessonResults) { // 레슨결과 하나씩 조회
            Long lessonId = lr.getLesson().getLessonId();
            LocalDateTime lessonResultDt = lr.getLessonDt();
            if(lessonGroupResultStartDt.isBefore(lessonResultDt)) { // 이번에 학습한 레슨결과다
                if(lr.getIsSkipped()) { // 건너뛰기 한 레슨결과다
                    lessonResultMap.put(lessonId, lr);
                    expMap.put(lessonId, 0L);
                    maxSimilarityMap.put(lessonId, 0L);
                    maxAccuracyMap.put(lessonId, 0L);
                } else { // 건너뛰기 하지 않았다
                    lessonResultMap.put(lessonId, lr);
                    expMap.put(lessonId, 20L);
                    maxSimilarityMap.put(lessonId, lr.getAccentSimilarity());
                    maxAccuracyMap.put(lessonId, lr.getPronunciationAccuracy());
                }
            } else { // 저번에 학습한 레슨결과다 -> 처음 학습한거, 건너뛰기한 결과는 여기 올 수 없다.
                if(lessonResultMap.containsKey(lessonId)) { // lessonResultMap에 조회가 된다 -> 이전에 학습한 결과가 있다.
                    Long currentScore = (lessonResultMap.get(lessonId).getAccentSimilarity() + lessonResultMap.get(lessonId).getPronunciationAccuracy()) / 2;
                    Long prevScore = (lr.getAccentSimilarity() + lr.getPronunciationAccuracy()) / 2;
                    if(currentScore > prevScore) { // 이번에 학습한 score가 더 높다
                        if(expMap.get(lessonId).equals(0L)) { // 경험치가 0exp 이다.
                            // 이미 복습을 실패했다. 그리고 score에도 이미 더 높은 수치가 들어가있다.
                            continue outer;
                        }
                        expMap.replace(lessonId, 10L);
                    } else { // 이전에 학습한 score가 더 높다
                        expMap.replace(lessonId, 0L);
                        Long prevMaxScore = (maxAccuracyMap.get(lessonId) + maxSimilarityMap.get(lessonId)) / 2;

                        // scoreMap을 더 높은 값으로 갱신
                        if(prevScore > prevMaxScore) { // max로 되어있는 score보다 더 높은게 나오면
                            maxSimilarityMap.replace(lessonId, lr.getAccentSimilarity());
                            maxAccuracyMap.replace(lessonId, lr.getPronunciationAccuracy());
                        }
                    }

                } else { // lessonResultMap에 조회가 안된다 -> 사용자가 이전에 학습했어서 건너뛰기 했다.
                    // pq에 추가해야한다.
                    if(pqMap.containsKey(lessonId)) { // pq에 이미 추가된 레슨결과가 있으면
                        pqMap.get(lessonId).offer(lr); // lessonResult 넣기
                    } else { // pq에 추가된 레슨결과가 없으면
                        pqMap.put(lessonId, new PriorityQueue<>(new Comparator<LessonResultEntity>() { // pq를 초기화
                            @Override
                            public int compare(LessonResultEntity o1, LessonResultEntity o2) {
                                Long o1Score = (o1.getAccentSimilarity() + o1.getPronunciationAccuracy()) / 2;
                                Long o2Score = (o2.getAccentSimilarity() + o2.getPronunciationAccuracy()) / 2;
                                return Long.compare(o2Score, o1Score);
                            }
                        }));
                        pqMap.get(lessonId).offer(lr); // lessonResult 넣기
                    }
                }
            }
        } // end for lessonResult

        // isBeforeResult 설정을 위해 DTO를 미리 만들자.
        List<LessonResultForSaveGroupResultDTO> lessonResultDtoLst = new ArrayList<>();
        for (Long lessonId : lessonResultMap.keySet()) {
            LessonResultForSaveGroupResultDTO lessonResultDto = new LessonResultForSaveGroupResultDTO(lessonResultMap.get(lessonId), false);
            lessonResultDtoLst.add(lessonResultDto);
        }

        // pq에 값이 있는지 확인
        for (Long lessonId : pqMap.keySet()) {
            LessonResultEntity first = pqMap.get(lessonId).poll();
            // pq의 최고 우선순위를 빼서 lessonResultMap에 넣는다.
            lessonResultMap.put(first.getLesson().getLessonId(), first);
            // isBeforeResult를 true로 해야한다.
            LessonResultForSaveGroupResultDTO lessonResultDto = new LessonResultForSaveGroupResultDTO(lessonResultMap.get(lessonId), true);
            lessonResultDtoLst.add(lessonResultDto);
        }

        // lessonGroupResult를 갱신하자
        int lessonResultCnt = 0;
        Long sumSimilarity = 0L;
        Long sumAccuracy = 0L;
        for (Long lessonId : maxAccuracyMap.keySet()) {
            if(maxAccuracyMap.get(lessonId).equals(0L)) continue;
            lessonResultCnt++;
            sumSimilarity += maxSimilarityMap.get(lessonId); // 누적
            sumAccuracy += maxAccuracyMap.get(lessonId); // 누적
        }
        Long avgSimilarity; // 평균
        Long avgAccuracy; // 평균
        if(lessonResultCnt != 0) {
            avgSimilarity = sumSimilarity / lessonResultCnt; // 평균
            avgAccuracy = sumAccuracy / lessonResultCnt; // 평균
        } else {
            avgSimilarity = 0L;
            avgAccuracy = 0L;
        }

        lessonGroupResult.setAvgSimilarity(avgSimilarity); // score 갱신
        lessonGroupResult.setAvgAccuracy(avgAccuracy); // score 갱신
        if(lessonResultCnt == 5) { // 건너뛰기한게 없으면
            lessonGroupResult.setEndDt(LocalDateTime.now());
            lessonGroupResult.setIsCompleted(true);
        }

        // 경험치를 부여하자
        Long sumExp = 0L;
        for (Long lessonId : expMap.keySet()) {
            sumExp += expMap.get(lessonId);
        }
        UserEntity user = userRepository.findByUserId(userId).orElse(null);
        Long prevUserExp = user.getExp();
        user.setExp(prevUserExp + sumExp);
        Long curUserExp = user.getExp();

        // DTO를 만들자
        UserExpInfoCurExpAndEarnExp userExpDto = new UserExpInfoCurExpAndEarnExp(prevUserExp, sumExp, curUserExp);
        LessonGroupResultForSaveLessonGroupDTO lessonGroupResultForSaveLessonGroup = new LessonGroupResultForSaveLessonGroupDTO(lessonGroupResult);

        return new LessonGroupResultSaveResponseDTO(userExpDto, lessonResultDtoLst, lessonGroupResultForSaveLessonGroup);
    }

    public List<LessonGroupResultEntity> findLessonGroupResultWithoutIsCompletedAllByUserId(Long userId) {
        return lessonRepository.findLessonGroupResultByUserIdWithoutIsCompleted(userId).orElse(null);
    }

    public List<LessonResultEntity> findLessonResultByLessonGroupResultId(Long lessonGroupResultId) {
        return lessonRepository.findLessonResultByLessonGroupResultId(lessonGroupResultId).orElse(null);
    }

    public List<LessonResultEntity> findAllLessonResult() {
        return lessonRepository.findAllLessonResult().orElse(null);

    }
}
