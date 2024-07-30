package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.admin.UserBanRequestDTO;
import com.tunapearl.saturi.dto.user.UserMsgResponseDTO;
import com.tunapearl.saturi.service.user.AdminService;
import com.tunapearl.saturi.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/claim")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminClaimController {

    private final AdminService adminService;
    private final UserService userService;

    /**
     * 회원 정지
     */
    @PostMapping("/user")
    public ResponseEntity<UserMsgResponseDTO> userBan(@RequestBody @Valid UserBanRequestDTO request) {
        log.info("Received user ban request for {}", request.getUserId());
        return ResponseEntity.ok().body(adminService.banUser(request));
    }
}
