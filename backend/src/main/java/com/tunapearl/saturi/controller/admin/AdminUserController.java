package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.domain.user.UserEntity;
import com.tunapearl.saturi.dto.admin.UserInfoDTO;
import com.tunapearl.saturi.service.user.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminUserController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<UserInfoDTO>> getAllUsersSortedByExp() {
        List<UserEntity> findUsers = adminService.getAllUsersSortedByExp();
        List<UserInfoDTO> result = findUsers.stream()
                .map(u -> new UserInfoDTO(u)).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("{userId}")
    public ResponseEntity<UserInfoDTO> getUser(@PathVariable("userId") Long userId) {
        UserEntity findUser = adminService.findUserById(userId);
        UserInfoDTO result = new UserInfoDTO(findUser.getUserId(), findUser.getLocation().getLocationId(),
                findUser.getEmail(), findUser.getNickname(), findUser.getRegDate(), findUser.getExp(),
                findUser.getGender(), findUser.getRole(), findUser. getBird().getId(), findUser.getReturnDt());
        return ResponseEntity.ok(result);
}
