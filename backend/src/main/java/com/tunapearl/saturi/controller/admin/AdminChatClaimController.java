package com.tunapearl.saturi.controller.admin;

import com.tunapearl.saturi.dto.admin.UserBanRequestDTO;
import com.tunapearl.saturi.dto.admin.claim.ClaimDeleteRequestDto;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadRequestDto;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadResponseDto;
import com.tunapearl.saturi.dto.user.UserMsgResponseDTO;
import com.tunapearl.saturi.service.ChatClaimService;
import com.tunapearl.saturi.service.user.AdminService;
import com.tunapearl.saturi.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/claim")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminChatClaimController {

    private final AdminService adminService;
    private final UserService userService;
    private final ChatClaimService chatClaimService;

    /**
     * 회원 정지
     */
    @PostMapping("/user")
    public ResponseEntity<UserMsgResponseDTO> userBan(@RequestBody @Valid UserBanRequestDTO request) {
        log.info("Received user ban request for {}", request.getUserId());
        return ResponseEntity.ok().body(adminService.banUser(request));
    }

    /*
    * 채팅 신고
    */
    @PostMapping("/user/{gameLogId}")
    public ResponseEntity<?> claimUserChat(@PathVariable Long gameLogId){
        log.info("Received claim user chatting for {}", gameLogId);
        chatClaimService.saveClaim(gameLogId);
        return new ResponseEntity<String>(String.format("신고 완료 %d", gameLogId), HttpStatus.CREATED);
    }

    /*
    * 채팅 신고 조회
    */
    @GetMapping("/user")
    public ResponseEntity<?> getAllChatClaim(@ModelAttribute ClaimReadRequestDto request) {
        log.info("Received all claim request for {}", request);
        List<ClaimReadResponseDto> list = chatClaimService.findAll(request);
        log.info("Received all claim response for {}", list);
        return ResponseEntity.ok(list);
    }

    /*
    * 채팅 신고 삭제
    * TODO: ClaimDeleteRequest 제거하고 PathVariable로 변경
    */
    @DeleteMapping("/user/{chatClaimId}")
    public ResponseEntity<?> deleteChatClaim(@PathVariable Long chatClaimId) {
        log.info("Received delete claim request for {}", chatClaimId);
        chatClaimService.removeClaim(chatClaimId);
        return ResponseEntity.ok("Delete claim successful");
    }
}
