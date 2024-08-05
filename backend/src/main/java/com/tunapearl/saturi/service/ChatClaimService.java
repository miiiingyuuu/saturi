package com.tunapearl.saturi.service;


import com.tunapearl.saturi.domain.game.ChatClaimEntity;
import com.tunapearl.saturi.domain.game.GameLogEntity;
import com.tunapearl.saturi.dto.admin.claim.ClaimDeleteRequestDto;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadRequestDto;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadResponseDto;
import com.tunapearl.saturi.repository.ChatClaimRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChatClaimService {

    private final ChatClaimRepository chatClaimRepository;

    /*
    * 유저 채팅 신고 전체 조회
    */
    public List<ClaimReadResponseDto> findAll(ClaimReadRequestDto request) {
        List<ChatClaimEntity> list = chatClaimRepository.findAll(request);
        return list.stream().map(this::convertReadDtoToEntity).collect(Collectors.toList());
    }

    /*
    * 유저 채팅 신고 삭제(DB에 남기고 봤다는 표시만 함)
    */
    public void removeClaim(ClaimDeleteRequestDto request) {
        chatClaimRepository.removeById(request);
    }

    /*
    * 유저 채팅 신고 처리
    */
    public void updateClaim(ClaimDeleteRequestDto request) {
        ChatClaimEntity entity = chatClaimRepository.findById(request)
                .orElseThrow(() -> new RuntimeException("Invalid chat claim id: " + request.getChatClaimId()));
        entity.check();
    }


    private ClaimReadResponseDto convertReadDtoToEntity(ChatClaimEntity chatClaimEntity) {
        GameLogEntity gameLogEntity = chatClaimEntity.getGameLog();
        return ClaimReadResponseDto.builder()
                .chatClaimId(chatClaimEntity.getChatClaimId())
                .gameLogId(gameLogEntity.getGameLogId())
                .userId(gameLogEntity.getUser().getUserId())
                .roomId(gameLogEntity.getRoom().getRoomId())
                .quizId(gameLogEntity.getQuiz().getQuizId())
                .chatting(gameLogEntity.getChatting())
                .chattingDt(gameLogEntity.getChattingDt())
                .claimedDt(chatClaimEntity.getClaimedDt())
                .isChecked(chatClaimEntity.isChecked())
                .build();
    }
}
