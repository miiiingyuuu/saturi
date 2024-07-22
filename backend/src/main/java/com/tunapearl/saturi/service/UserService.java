package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.user.*;
import com.tunapearl.saturi.dto.user.*;
import com.tunapearl.saturi.exception.DuplicatedUserEmailException;
import com.tunapearl.saturi.exception.DuplicatedUserNicknameException;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.utils.PasswordEncoder;
import com.tunapearl.saturi.utils.RedisUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final RedisUtil redisUtil;

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
        validateDuplicateUserEmail(request.getEmail());
        validateDuplicateUserNickname(request.getNickname());
        UserEntity user = createNewUser(request);
        userRepository.saveUser(user);
        return new UserMsgResponseDTO("유저 회원가입 성공");
    }

    public void validateDuplicateUserEmail(String email) {
        List<UserEntity> findUsers = userRepository.findByEmail(email).get();
        if(!findUsers.isEmpty()) {
//            throw new IllegalStateException("이미 존재하는 회원입니다.");
            throw new DuplicatedUserEmailException("이미 존재하는 회원입니다.");
        }
    }

    public void validateDuplicateUserNickname(String nickname) {
        List<UserEntity> findUsers = userRepository.findByNickname(nickname).get();
        if(!findUsers.isEmpty()) {
//            throw new IllegalStateException("이미 존재하는 닉네임입니다.");
            throw new DuplicatedUserNicknameException("이미 존재하는 닉네임입니다.");
        }
    }

    private static UserEntity createNewUser(UserRegisterRequestDTO request) {
        UserEntity user = new UserEntity();
        // TODO 생성자로 생성하기
        user.setEmail(request.getEmail());
        user.setPassword(PasswordEncoder.encrypt(request.getEmail(), request.getPassword()));
        user.setNickname(request.getNickname());
        user.setGender(request.getGender());
        user.setAgeRange(request.getAgeRange());
        user.setRegDate(LocalDateTime.now());
        user.setExp(0L);
        user.setRole(Role.BASIC);
        return user;
    }

    /**
     * 일반회원 로그인
     */
    public UserLoginResponseDTO loginUser(UserLoginRequestDTO request) {
        List<UserEntity> findUsers = userRepository.findByEmailAndPassword(request.getEmail(),
                PasswordEncoder.encrypt(request.getEmail(), request.getPassword())).get();
        validateAuthenticateUser(findUsers); // 아이디, 비밀번호 일치 여부 검증
        UserEntity findUser = findUsers.get(0);
        validateDeletedUser(findUser); // 탈퇴회원 검증
        //TODO JWT 토큰 발급
        return new UserLoginResponseDTO(findUser.getUserId(), findUser.getEmail(), findUser.getNickname(), findUser.getRegDate(),
                findUser.getExp(), findUser.getGender(), findUser.getRole(), findUser.getAgeRange(), findUser.getQuokka());
    }

    private static void validateDeletedUser(UserEntity user) {
        if(user.getIsDeleted()) throw new IllegalStateException("탈퇴된 회원입니다.");
    }

    private static void validateAuthenticateUser(List<UserEntity> findUsers) {
        if(findUsers.isEmpty()) {
            throw new IllegalStateException("아이디 혹은 비밀번호가 일치하지 않습니다.");
        }
    }
    /**
     * 로그아웃
     */
    public UserMsgResponseDTO logoutUser(UserLogoutRequestDTO request) {
        //TODO JWT 토큰 삭제
        return new UserMsgResponseDTO("로그아웃 완료");
    }

    /**
     * 회원 수정
     */
    @Transactional
    public UserMsgResponseDTO updateUser(UserUpdateRequestDTO request) {
        validateDuplicateUserNickname(request.getNickname());
        UserEntity findUser = userRepository.findByUserId(request.getUserId()).get();
        changeUserInfo(findUser, request.getNickname(), request.getLocation(), request.getGender(), request.getRole());
        return new UserMsgResponseDTO("회원 수정 완료");
    }

    private void changeUserInfo(UserEntity findUser, String nickname, Location location, Gender gender, Role role) {
        findUser.setNickname(nickname);
        findUser.setLocation(location);
        findUser.setGender(gender);
        findUser.setRole(role);
    }

    /**
     * 일반회원 비밀번호 변경
     */
    @Transactional
    public UserPasswordUpdateResponseDTO updateUserPassword(UserPasswordUpdateRequestDTO request) {
        UserEntity findUser = userRepository.findByUserId(request.getUserId()).get();
        validateCorrectCurrentPassword(request.getCurrentPassword(), findUser); // 현재 비밀번호 검증
        validateCheckNewPassword(request.getNewPassword(), findUser); // 현재, 새로운 비밀번호 동일 여부 검증
        findUser.setPassword(PasswordEncoder.encrypt(findUser.getEmail(), request.getNewPassword()));
        return new UserPasswordUpdateResponseDTO(findUser.getUserId());
    }

    private static void validateCorrectCurrentPassword(String currentPassword, UserEntity findUser) {
        if(!findUser.getPassword().equals(PasswordEncoder.encrypt(findUser.getEmail(), currentPassword))) {
            throw new IllegalStateException("현재 비밀번호가 일치하지 않습니다.");
        }
    }

    private static void validateCheckNewPassword(String newPassword, UserEntity findUser) {
        if(findUser.getPassword().equals(PasswordEncoder.encrypt(findUser.getEmail(), newPassword))) {
            throw new IllegalStateException("현재 비밀번호와 일치합니다. 새로운 비밀번호로 변경해주세요.");
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
        findUser.setDeletedDt(LocalDateTime.now());
        findUser.setIsDeleted(true);
    }

    /**
     * 이메일 인증
     */
    public int makeRandomNumber() {
        Random r = new Random();
        String randomNumber = "";
        for(int i = 0; i < 6; i++) {
            randomNumber += Integer.toString(r.nextInt(10));
        }
        return Integer.parseInt(randomNumber);
    }

    public boolean CheckAuthNum(String email, String authNum) {
        if(redisUtil.getData(authNum) == null){
            return false;
        }
        else if(redisUtil.getData(authNum).equals(email)){
            return true;
        }
        else{
            return false;
        }
    }

    public String joinEmail(String email) throws MessagingException {
        int authNumber = makeRandomNumber();
        String setFrom = "gkwo7108@gmail.com"; // email-config에 설정한 자신의 이메일 주소를 입력
        String toMail = email;
        String title = "사투리는 서툴러유 인증번호";
        String content =
                "사투리는 서툴러유를 방문해주셔서 감사합니다😊" +
                        "<br><br>" +
                        "인증 번호는 " + authNumber + "입니다." +
                        "<br>" +
                        "인증번호를 홈페이지 내에 입력해주세요";
        mailSend(setFrom, toMail, title, content, authNumber);
        return Integer.toString(authNumber);
    }

    public void mailSend(String setFrom, String toMail, String title, String content, int authNumber) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage(); //JavaMailSender 객체를 사용하여 MimeMessage 객체를 생성
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,true,"utf-8");
            // true를 전달하여 multipart 형식의 메시지를 지원하고, "utf-8"을 전달하여 문자 인코딩을 설정
            helper.setFrom(setFrom); // 이메일의 발신자 주소 설정
            helper.setTo(toMail); // 이메일의 수신자 주소 설정
            helper.setSubject(title); // 이메일의 제목을 설정
            helper.setText(content,true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        redisUtil.setDataExpire(Integer.toString(authNumber), toMail, 60*5L);

    }

    /**
     * 회원 프로필 조회
     */
    public UserInfoResponseDTO getUserProfile(Long userId) {
        UserEntity findUser = userRepository.findByUserId(userId).get();
        return new UserInfoResponseDTO(findUser.getUserId(), findUser.getEmail(), findUser.getNickname(), findUser.getRegDate(),
                findUser.getExp(), findUser.getGender(), findUser.getRole(), findUser.getAgeRange(), findUser.getQuokka());
    }

    public Long getUserIdByToken() {
        //TODO 토큰 디코딩 필요
        return null;
    }


}
