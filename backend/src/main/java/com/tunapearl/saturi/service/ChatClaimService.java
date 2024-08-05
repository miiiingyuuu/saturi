package com.tunapearl.saturi.service;


import com.tunapearl.saturi.domain.game.ChatClaimEntity;
import com.tunapearl.saturi.domain.game.GameLogEntity;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadRequestDto;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadResponseDto;
import com.tunapearl.saturi.repository.ChatClaimRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChatClaimService {

    private final ChatClaimRepository chatClaimRepository;

    public List<ClaimReadResponseDto> findAll(ClaimReadRequestDto request) {
        List<ChatClaimEntity> list = chatClaimRepository.findAll(request);
        return list.stream().map(this::convertReadDtoToEntity).collect(Collectors.toList());
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
