package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.domain.user.Role;
import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.UserBanRequestDTO;
import com.tunapearl.saturi.dto.user.UserMsgResponseDTO;
import com.tunapearl.saturi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public UserMsgResponseDTO banUser(UserBanRequestDTO request) {
        UserEntity findUser = userRepository.findByUserId(request.getUserId()).get();
        findUser.setRole(Role.BANNED);
        LocalDateTime returnDt = LocalDateTime.now().plusDays(request.getBanDate());
        findUser.setReturnDt(returnDt);

        return new UserMsgResponseDTO("ok");
    }
}
