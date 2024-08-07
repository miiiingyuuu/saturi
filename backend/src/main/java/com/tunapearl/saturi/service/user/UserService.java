package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
import com.tunapearl.saturi.domain.lesson.LessonResultEntity;
import com.tunapearl.saturi.domain.user.*;
import com.tunapearl.saturi.dto.lesson.LessonGroupResultIdAndLessonId;
import com.tunapearl.saturi.dto.user.*;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.BirdRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import com.tunapearl.saturi.repository.redis.EmailRepository;
import com.tunapearl.saturi.service.RedisService;
import com.tunapearl.saturi.service.lesson.LessonService;
import com.tunapearl.saturi.utils.JWTUtil;
import com.tunapearl.saturi.utils.PasswordEncoder;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.regex.Pattern;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final RedisService redisService;
    private final EmailRepository emailRepository;
    private final JWTUtil jwtUtil;
    private final TokenService tokenService;
    private final LocationService locationService;
    private final BirdService birdService;
    private final BirdRepository birdRepository;
    private final LessonService lessonService;

    /**
     * 정규표현식
     */
    // 이메일 정규표현식(aaa@a~)
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9]+@(.+)$";
    // 비밀번호 정규표현식(8자 이상, 숫자 1, 특수문자(!@#$%^&+=) 1 포함)
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&+=])(?=\\S+$).{8,}$";
    // 닉네임 정규표현식
    private static final String NICKNAME_PATTERN = "^(?!.*[ㄱ-ㅎㅏ-ㅣ])[A-Za-z0-9가-힣]{1,10}$";

    private final LessonRepository lessonRepository;

    public List<UserEntity> findUsers() {
        return userRepository.findAll().get();
    }

    public UserEntity findById(Long id) {
        return userRepository.findByUserId(id).get();
    }

    /**
     * 일반회원 회원가입
     */
    @Transactional
    public UserMsgResponseDTO registerUser(UserRegisterRequestDTO request) {
        validateEmail(request.getEmail());
        validatePassword(request.getPassword());
        validateNickname(request.getNickname());
        validateDuplicateUserEmail(request.getEmail());
        validateDuplicateUserNickname(request.getNickname());
        UserEntity user = createNewUser(request);
        userRepository.saveUser(user);
        return new UserMsgResponseDTO("유저 회원가입 성공");
    }

    private static void validateEmail(String email) {
        if (!Pattern.matches(EMAIL_PATTERN, email)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다");
        }
    }

    private static void validatePassword(String password) {
        if (!Pattern.matches(PASSWORD_PATTERN, password)) {
            throw new IllegalArgumentException("유효하지 않은 비밀번호 형식입니다");
        }
    }

    private static void validateNickname(String nickname) {
        if (!Pattern.matches(NICKNAME_PATTERN, nickname)) {
            throw new IllegalArgumentException("유효하지 않은 닉네임 형식입니다");
        }
    }

    public void validateDuplicateUserEmail(String email) {
        Optional<List<UserEntity>> findUsers = userRepository.findByEmail(email);
        if (findUsers.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 회원입니다.");
        }
    }

    public void validateDuplicateUserNickname(String nickname) {
        Optional<List<UserEntity>> findUsers = userRepository.findByNickname(nickname);
        if (findUsers.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }
    }

    private UserEntity createNewUser(UserRegisterRequestDTO request) {
        log.info("request = {}", request);
        UserEntity user = new UserEntity();
        user.setEmail(request.getEmail());
        user.setPassword(PasswordEncoder.encrypt(request.getEmail(), request.getPassword()));
        user.setNickname(request.getNickname());
        user.setLocation(locationService.findById(1L));
        user.setGender(Gender.DEFAULT);
        user.setAgeRange(AgeRange.DEFAULT);
        user.setRegDate(LocalDateTime.now());
        user.setBird(birdRepository.findById(1L).orElse(null));
        user.setExp(10L);
        user.setRole(Role.BASIC);
        return user;
    }

    /**
     * 일반회원 로그인
     */
    public UserLoginResponseDTO loginUser(UserLoginRequestDTO request) {
        validatePasswordIsNullOrEmpty(request);
        List<UserEntity> findUsers = userRepository.findByEmailAndPassword(request.getEmail(), PasswordEncoder.encrypt(request.getEmail(), request.getPassword())).get();
        validateAuthenticateUser(findUsers); // 아이디, 비밀번호 일치 여부 검증
        UserEntity findUser = findUsers.get(0);
//        validateDeletedUser(findUser); // 탈퇴회원 검증
        validateBannedUser(findUser); // 정지회원 검증

        return tokenService.saveRefreshToken(findUser.getUserId());
    }

    private static void validatePasswordIsNullOrEmpty(UserLoginRequestDTO request) {
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("비밀번호를 제대로 입력하거나 다른 방법으로 로그인하세요");
        }
    }

    private static void validateAuthenticateUser(List<UserEntity> findUsers) {
        if (findUsers.isEmpty()) {
            throw new IllegalArgumentException("아이디 혹은 비밀번호가 일치하지 않습니다.");
        }
    }

    private static void validateBannedUser(UserEntity findUser) {
        if (findUser.getRole() == Role.BANNED) {
            if (LocalDateTime.now().isBefore(findUser.getReturnDt())) {
                throw new IllegalStateException("계정이 정지되었습니다. [계정 복귀 일시 : " + findUser.getReturnDt() + " ]");
            }
            findUser.setRole(Role.BASIC); // 밴 상태인데 복귀 날짜가 지났으면 다시 역할 돌리기
        }
    }

    /**
     * 로그아웃
     */
    @Transactional
    public UserMsgResponseDTO logoutUser(String token) throws UnAuthorizedException {
        tokenService.deleteRefreshToken(jwtUtil.getUserId(token));
        return new UserMsgResponseDTO("로그아웃 완료");
    }

    /**
     * 회원 수정
     */
    @Transactional
    public UserMsgResponseDTO updateUser(Long userId, UserUpdateRequestDTO request) {
        if(request.getIsChanged().equals(1L)) {
            validateNickname(request.getNickname());
            validateDuplicateUserNickname(request.getNickname());
        }
        UserEntity findUser = userRepository.findByUserId(userId).get();
        BirdEntity bird = birdService.findById(request.getBirdId());
        LocationEntity location = locationService.findById(request.getLocationId());
        changeUserInfo(findUser, request.getNickname(), location, request.getGender(), request.getAgeRange(), bird);
        return new UserMsgResponseDTO("회원 수정 완료");
    }

    private void changeUserInfo(UserEntity findUser, String nickname, LocationEntity location, Gender gender, AgeRange ageRange, BirdEntity bird) {
        findUser.setNickname(nickname);
        findUser.setLocation(location);
        findUser.setGender(gender);
        findUser.setAgeRange(ageRange);
        findUser.setBird(bird);
    }

    /**
     * 일반회원 비밀번호 변경
     */
    @Transactional
    public UserMsgResponseDTO updateUserPassword(Long userId, UserPasswordUpdateRequestDTO request) {
        UserEntity findUser = userRepository.findByUserId(userId).get();
        validateCorrectCurrentPassword(request.getCurrentPassword(), findUser); // 현재 비밀번호 검증
        validatePassword(request.getNewPassword());
        validateCheckNewPassword(request.getNewPassword(), findUser); // 현재, 새로운 비밀번호 동일 여부 검증
        findUser.setPassword(PasswordEncoder.encrypt(findUser.getEmail(), request.getNewPassword()));
        return new UserMsgResponseDTO("ok");
    }

    private static void validateCorrectCurrentPassword(String currentPassword, UserEntity findUser) {
        if (!findUser.getPassword().equals(PasswordEncoder.encrypt(findUser.getEmail(), currentPassword))) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
    }

    private static void validateCheckNewPassword(String newPassword, UserEntity findUser) {
        if (findUser.getPassword().equals(PasswordEncoder.encrypt(findUser.getEmail(), newPassword))) {
            throw new IllegalArgumentException("현재 비밀번호와 일치합니다. 새로운 비밀번호로 변경해주세요.");
        }
    }

    /**
     * 회원 삭제
     */
    @Transactional
    public UserMsgResponseDTO deleteUser(Long userId) {
        UserEntity findUser = userRepository.findByUserId(userId).get();
        changeUserDeleteStatus(findUser);
        return new UserMsgResponseDTO("회원 탈퇴 완료");
    }

    private void changeUserDeleteStatus(UserEntity findUser) {
        findUser.setEmail(null);
        findUser.setDeletedDt(LocalDateTime.now());
        findUser.setIsDeleted(true);
    }

    /**
     * 이메일 인증
     */
    public String makeRandomAuthCode() {
        Random r1 = new Random();
        Random r2 = new Random();
        StringBuilder randomNumber = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            if (r1.nextBoolean()) randomNumber.append(Integer.toString(r2.nextInt(10)));
            else randomNumber.append((char) (r2.nextInt(26) + 97));
        }
        return randomNumber.toString();
    }

    public boolean checkAuthNum(String email, String authNum) {

//        String getAuthNum = redisService.getData(authNum);
//        String getAuthNum = emailRepository.findById(email).get().getAuthNum();
//        if (getAuthNum == null) return false;
//        return getAuthNum.equals(authNum);

        Optional<RedisEmail> optionalUser = emailRepository.findById(email);
        if (optionalUser.isPresent()) {
            String getAuthNum = optionalUser.get().getAuthNum();
            return getAuthNum.equals(authNum);
        }
        return false;
    }

    public String setEmailSend(String email) throws MessagingException {
        String authCode = makeRandomAuthCode();
        String setFromEmail = "gkwo7108@gmail.com";
        //FIXME 인증 보내는 내용 수정 필요(디자인)
        String title = "사투리가 서툴러유 인증번호";
        String content = "사투리가 서툴러유를 방문해주셔서 감사합니다😊" + "<br><br>" + "인증 번호는 [ " + authCode + " ] 입니다." + "<br>" + "인증번호를 홈페이지에서 입력해주세요";
        emailSend(setFromEmail, email, title, content, authCode);
        return authCode;
    }

    public void emailSend(String setFromEmail, String setToEmail, String title, String content, String authCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
        helper.setFrom(setFromEmail);
        helper.setTo(setToEmail);
        helper.setSubject(title);
        helper.setText(content, true);
        mailSender.send(message);
//        redisService.setDataExpire(authCode, setToEmail, 60 * 5L); // redis에 인증번호 저장("1a2a3a" : "email@email")
        emailRepository.save(new RedisEmail(setToEmail, authCode));
    }

    /**
     * 회원 프로필 조회
     */
    public UserInfoResponseDTO getUserProfile(Long userId) {
        UserEntity findUser = userRepository.findByUserId(userId).orElse(null);
        log.info("find User Profile {}", findUser);
        return new UserInfoResponseDTO(findUser.getEmail(), findUser.getNickname(), findUser.getRegDate(), findUser.getExp(), findUser.getGender(), findUser.getRole(), findUser.getAgeRange(), findUser.getLocation().getLocationId(), findUser.getBird().getId());
    }

    /**
     * 어드민회원 회원가입
     */
    @Transactional
    public UserMsgResponseDTO registerAdminUser(UserRegisterRequestDTO request) {
        validateEmail(request.getEmail());
        validatePassword(request.getPassword());
        validateDuplicateUserEmail(request.getEmail());
        validateDuplicateUserNickname(request.getNickname());
        UserEntity user = createAdminUser(request);
        userRepository.saveUser(user);
        return new UserMsgResponseDTO("유저 회원가입 성공");
    }

    private UserEntity createAdminUser(UserRegisterRequestDTO request) {
        UserEntity user = new UserEntity();
        user.setEmail(request.getEmail());
        user.setPassword(PasswordEncoder.encrypt(request.getEmail(), request.getPassword()));
        user.setNickname(request.getNickname());
        user.setLocation(locationService.findById(1L));
        user.setGender(Gender.DEFAULT);
        user.setAgeRange(AgeRange.DEFAULT);
        user.setRegDate(LocalDateTime.now());
        user.setBird(birdRepository.findById(1L).orElse(null));
        user.setExp(20L);
        user.setRole(Role.ADMIN);
        return user;
    }

    public Long getUserRank(Long userId) {
        List<UserEntity> findUsers = userRepository.findAllSortedByExp().orElse(null);
        for (int i=0; i < findUsers.size(); i++) {
            if(findUsers.get(i).getUserId().equals(userId)) {
                return Long.valueOf(i+1);
            }
        }
        return null;
    }

    public UserExpInfoDTO getUserExpInfo(Long userId) {
        UserEntity findUser = userRepository.findByUserId(userId).orElse(null);
        Long currentExp = findUser.getExp();
        Long UserRank = getUserRank(userId);
        return new UserExpInfoDTO(currentExp, UserRank);
    }

    public UserRecentLessonGroupDTO getUserRecentLessonGroup(Long userId) {
        List<LessonGroupResultEntity> lessonGroupResults = lessonService.findLessonGroupResultWithoutIsCompletedAllByUserId(userId);
        if(lessonGroupResults == null) return null;
        lessonGroupResults.sort(Comparator.comparing(LessonGroupResultEntity::getStartDt).reversed());

        LessonGroupResultEntity recentLessonGroup = lessonGroupResults.get(0);
        return new UserRecentLessonGroupDTO(recentLessonGroup);
    }

    public UserContinuousLearnDayDTO getUserContinuousLearnDay(Long userId) {
        /**
         * 연속 학습 일 수 구하기
         */
        Long learnDays = 0L;
        // 유저 아이디로 모든 레슨 그룹 결과 조회
        List<LessonGroupResultEntity> lessonGroupResults = lessonService.findLessonGroupResultWithoutIsCompletedAllByUserId(userId);
        if(lessonGroupResults == null) {
            LocalDate today = LocalDate.now();

            // 이번 주 첫째날 구하기
            WeekFields weekFields = WeekFields.of(DayOfWeek.MONDAY, 1);

            List<Integer> weekAndMonth = new ArrayList<>();
            int weekOfMonth = today.get(weekFields.weekOfMonth());
            int month = today.getMonthValue();
            weekAndMonth.add(month);
            weekAndMonth.add(weekOfMonth);

            return new UserContinuousLearnDayDTO(0L, new ArrayList<Integer>(), weekAndMonth);
        }

        // 레슨 그룹 결과 아이디로 모든 레슨 결과 조회
        List<LessonResultEntity> lessonResults = new ArrayList<>();
        for (LessonGroupResultEntity lgr : lessonGroupResults) {
            List<LessonResultEntity> findLessonResult = lessonService.findLessonResultByLessonGroupResultId(lgr.getLessonGroupResultId());
            lessonResults.addAll(findLessonResult);
        }

        // 레슨 학습 일시를 최근 순으로 정렬한 뒤, 오늘 학습 했으면 오늘 기준으로 계산하고, 어제 학습했으면 어제 기준으로 계산
        lessonResults.sort(Comparator.comparing(LessonResultEntity::getLessonDt).reversed());
        LessonResultEntity mostRecentLessonResult = lessonResults.get(0);
        if(mostRecentLessonResult.getLessonDt().toLocalDate().equals(LocalDate.now()) || // 오늘 학습 했는지
            mostRecentLessonResult.getLessonDt().toLocalDate().equals(LocalDate.now().minusDays(1))) { // 혹은 어제 학습했는지
            learnDays++;
            LocalDate currentDate = mostRecentLessonResult.getLessonDt().toLocalDate();
            for (int i = 0; i < lessonResults.size(); i++) {
                if(i == 0) continue;
                if(lessonResults.get(i).getLessonDt().toLocalDate().equals(currentDate.minusDays(1))) {
                    learnDays++;
                    currentDate = lessonResults.get(i).getLessonDt().toLocalDate();
                }
            }
        }
        // 오늘, 어제 둘 다 안했으면 0일로 리턴

        /**
         * 이번 주 학습한 요일 구하기
         */
        List<Integer> daysOfTheWeek = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 이번 주 첫째날 구하기
        WeekFields weekFields = WeekFields.of(DayOfWeek.MONDAY, 1);
        LocalDate startOfWeek = today.with(weekFields.getFirstDayOfWeek());
        for (LessonResultEntity lessonResult : lessonResults) {
            LocalDate learnDate = lessonResult.getLessonDt().toLocalDate();

            // 이번주에 해당하는지
            if(!learnDate.isBefore(startOfWeek) && !learnDate.isAfter(startOfWeek.plusDays(6))) {
                DayOfWeek dayOfWeek = learnDate.getDayOfWeek();
                int dayValue = dayOfWeek.getValue() - 1; // 월요일을 0으로 설정 (일요일이 6)
                daysOfTheWeek.add(dayValue);
            } else {
                break; // 최근 순으로 조회하기 때문에, 이번주에 해당되지 않으면 바로 break 해도됨
            }
        }

        /**
         * 몇월 몇주차인지
         */
        List<Integer> weekAndMonth = new ArrayList<>();
        int weekOfMonth = today.get(weekFields.weekOfMonth());
        int month = today.getMonthValue();
        weekAndMonth.add(month);
        weekAndMonth.add(weekOfMonth);

        return new UserContinuousLearnDayDTO(learnDays, daysOfTheWeek, weekAndMonth);
    }

    public List<UserStreakInfoDaysDTO> getUserStreakInfoDays(Long userId) {
        List<UserStreakInfoDaysDTO> result = new ArrayList<>();
        // 유저 아이디로 모든 레슨 그룹 결과 조회
        List<LessonGroupResultEntity> lessonGroupResults = lessonService.findLessonGroupResultWithoutIsCompletedAllByUserId(userId);
        if(lessonGroupResults == null) return null;

        // 레슨 그룹 결과 아이디로 모든 레슨 결과 조회
        List<LessonResultEntity> lessonResults = new ArrayList<>();
        for (LessonGroupResultEntity lgr : lessonGroupResults) {
            List<LessonResultEntity> findLessonResult = lessonService.findLessonResultByLessonGroupResultId(lgr.getLessonGroupResultId());
            lessonResults.addAll(findLessonResult);
        }

        // 레슨 학습 일시를 최근 순으로 정렬, 올 해가 아니면 break
        Map<LocalDate, Integer> streakDays = new HashMap<>();
        lessonResults.sort(Comparator.comparing(LessonResultEntity::getLessonDt).reversed());
        for (LessonResultEntity lessonResult : lessonResults) {
            int year = lessonResult.getLessonDt().getYear();
            if(LocalDate.now().getYear() != year) break;
            LocalDate currentDate = lessonResult.getLessonDt().toLocalDate();
            streakDays.put(currentDate, streakDays.getOrDefault(currentDate, 0) + 1);
        }
        for (LocalDate d : streakDays.keySet()) {
            UserStreakDateDTO userStreakDate = new UserStreakDateDTO(d.getYear(), d.getMonthValue(), d.getDayOfMonth());
            Integer solvedNum = streakDays.get(d);
            result.add(new UserStreakInfoDaysDTO(userStreakDate, solvedNum));
        }
        return result;
    }

    public UserTotalLessonInfoDTO getUserTotalLessonInfo(Long userId) {
        // 유저 아이디로 모든 레슨 그룹 결과 조회
        List<LessonGroupResultEntity> lessonGroupResults = lessonService.findLessonGroupResultWithoutIsCompletedAllByUserId(userId);
        if(lessonGroupResults == null) return null;
        int totalLessonGroupResultCnt = lessonGroupResults.size();
        for (LessonGroupResultEntity lessonGroupResult : lessonGroupResults) {
            if(!lessonGroupResult.getIsCompleted()) totalLessonGroupResultCnt--;
        }

        // 레슨 그룹 결과 아이디로 모든 레슨 결과 조회
        Map<LessonGroupResultIdAndLessonId, Integer> lessonGroupResultIdAndLessonIdMap = new HashMap<>(); // 복습한 레슨은 거르기 용
        List<LessonResultEntity> lessonResults = new ArrayList<>();
        for (LessonGroupResultEntity lgr : lessonGroupResults) {
            List<LessonResultEntity> findLessonResult = lessonService.findLessonResultByLessonGroupResultId(lgr.getLessonGroupResultId());
            for (LessonResultEntity lr : findLessonResult) {
                LessonGroupResultIdAndLessonId lesson = new LessonGroupResultIdAndLessonId(
                        lr.getLessonGroupResult().getLessonGroupResultId(), lr.getLesson().getLessonId());
                if(lessonGroupResultIdAndLessonIdMap.containsKey(lesson)) continue;
                lessonGroupResultIdAndLessonIdMap.put(lesson, 1);
                lessonResults.add(lr);
            }
        }
        return new UserTotalLessonInfoDTO(totalLessonGroupResultCnt, lessonResults.size());
    }

    /**
     * 임시 비밀번호 생성
     */
    public String makeRandomTempPassword() {
        Random r1 = new Random();
        Random r2 = new Random();
        StringBuilder randomNumber = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            if (r1.nextBoolean()) randomNumber.append(Integer.toString(r2.nextInt(10)));
            else randomNumber.append((char) (r2.nextInt(26) + 97));
        }
        // 숫자 한 개 추가
        // 특수문자 한 개 추가
        randomNumber.append("1").append("!");
        return randomNumber.toString();
    }

    @Transactional
    public void changePasswordByTmpPassword(UserEntity user, String tmpPassword) {
        user.setPassword(PasswordEncoder.encrypt(user.getEmail(), tmpPassword));
    }
}

















