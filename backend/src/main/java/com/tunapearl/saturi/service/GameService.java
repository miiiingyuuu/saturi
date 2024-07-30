package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.game.GameTipEntity;
import com.tunapearl.saturi.dto.game.GameMatchingRequestDTO;
import com.tunapearl.saturi.dto.game.GameMatchingResponseDTO;
import com.tunapearl.saturi.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final RedisService redisService;

    /**
     * 팁 추가
     */
    @Transactional
    public void registTip(String content) {
        GameTipEntity gametip = new GameTipEntity();
        gametip.setContent(content);
        gameRepository.saveTip(gametip);
    }

    /**
     * 팁 조회
     */
    @Transactional
    public List<GameTipEntity> getTip() {

        return gameRepository.getTip().get();
    }

    /**
     * 게임 매칭
     */
    public GameMatchingResponseDTO matching(GameMatchingRequestDTO gameMatchingRequestDTO) {
        //TODO: 게임 대기열에 넣고
        redisService.addParticipant();

        //TODO: 매칭완료되면 게임방 생성
        //방 생성과 동시에 id받아와서 보낼것
        //TODO: 게임방 Id 반환
        return null;
    }
}
