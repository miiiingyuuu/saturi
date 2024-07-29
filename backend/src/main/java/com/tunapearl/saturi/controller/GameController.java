package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.game.GameTipEntity;
import com.tunapearl.saturi.dto.game.GameTipRequestDTO;
import com.tunapearl.saturi.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/game")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class GameController {

    private final GameService gameService;

    /**
     * 게임 매칭
     */
    @PostMapping("/room/in")
    public ResponseEntity<?> matchingRoom(@RequestParam("location") int locationId) {
        log.info("Received room matching request for {}", locationId);

        return null;
    }

    /**
     * 팁 조회
     */
    @PostMapping("/tip")
    public ResponseEntity<?> userTip(@RequestBody GameTipRequestDTO request) {

        log.info("Received insert gameTip for {}", request.getContent());
        gameService.registTip(request.getContent());
        return null;
    }

    @GetMapping("/tip")
    public ResponseEntity<?> getTip() {
        log.info("Received select gameTip");

        try {
            return ResponseEntity.ok().body(gameService.getTip());
        }catch(Exception e) {
            throw new RuntimeException("Error getting gameTip", e);
        }
    }
}
