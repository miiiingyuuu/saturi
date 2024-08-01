package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.user.*;
import com.tunapearl.saturi.dto.user.*;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.repository.BirdRepository;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.redis.EmailRepository;
import com.tunapearl.saturi.service.RedisService;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
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
    //    private final LocationRepository locationRepository;
    private final LocationService locationService;
    /**
     * 정규표현식
     */
    // 이메일 정규표현식(aaa@a~)
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9]+@(.+)$";
    // 비밀번호 정규표현식(8자 이상, 숫자 1, 특수문자(!@#$%^&+=) 1 포함)
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&+=])(?=\\S+$).{8,}$";
    private final BirdRepository birdRepository;

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
        validateDuplicateUserNickname(request.getNickname());
        UserEntity findUser = userRepository.findByUserId(userId).get();
        changeUserInfo(findUser, request.getNickname(), request.getLocationId(), request.getGender(), request.getAgeRange());
        return new UserMsgResponseDTO("회원 수정 완료");
    }

    private void changeUserInfo(UserEntity findUser, String nickname, Long locationId, Gender gender, AgeRange ageRange) {
        findUser.setNickname(nickname);
        findUser.getLocation().setLocationId(locationId);
        findUser.setGender(gender);
        findUser.setAgeRange(ageRange);
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
        return new UserInfoResponseDTO(findUser.getEmail(), findUser.getNickname(), findUser.getRegDate(), findUser.getExp(), findUser.getGender(), findUser.getRole(), findUser.getAgeRange(), findUser.getLocation().getName(), findUser.getBird().getId());
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
}