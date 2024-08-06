package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.game.GameRoomEntity;
import com.tunapearl.saturi.domain.lesson.LessonClaimEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupEntity;
import com.tunapearl.saturi.domain.lesson.LessonGroupResultEntity;
import com.tunapearl.saturi.domain.user.Role;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.UserBanRequestDTO;
import com.tunapearl.saturi.dto.user.UserMsgResponseDTO;
import com.tunapearl.saturi.repository.UserRepository;
import com.tunapearl.saturi.repository.game.GameRoomRepository;
import com.tunapearl.saturi.repository.lesson.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final GameRoomRepository gameRoomRepository;

    public UserMsgResponseDTO banUser(UserBanRequestDTO request) {
        UserEntity findUser = userRepository.findByUserId(request.getUserId()).get();
        findUser.setRole(Role.BANNED);
        LocalDateTime returnDt = LocalDateTime.now().plusDays(request.getBanDate());
        findUser.setReturnDt(returnDt);

        return new UserMsgResponseDTO("ok");
    }

    public List<UserEntity> getAllUsersSortedByExp() {
        return userRepository.findAllSortedByExp().orElse(null);
    }

    public List<UserEntity> getAllUsersExceptAdmin() {
        return userRepository.findAllExceptAdmin().orElse(null);
    }

    public List<LessonGroupEntity> findLessonGroupByLocationId(Long locationId) {
        return lessonRepository.findLessonGroupByLocationId(locationId).orElse(null);
    }

    public List<LessonGroupResultEntity> findLessonGroupResultByLessonGroupId(Long lessonGroupId) {
        return lessonRepository.findLessonGroupResultByLessonGroupId(lessonGroupId).orElse(null);
    }

    public List<LessonClaimEntity> findAllLessonClaim() {
        return lessonRepository.findAllLessonClaim().orElse(null);
    }

    public List<LessonGroupResultEntity> findAllLessonGroupResult() {
        return lessonRepository.findAllLessonGroupResult().orElse(null);
    }

    public List<GameRoomEntity> findAllGameRoom() {
        return gameRoomRepository.findAllGameRoom().orElse(null);
    }
}
