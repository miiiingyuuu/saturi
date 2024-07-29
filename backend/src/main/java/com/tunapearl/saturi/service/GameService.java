package com.tunapearl.saturi.service;

import com.tunapearl.saturi.domain.game.GameTipEntity;
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
}
