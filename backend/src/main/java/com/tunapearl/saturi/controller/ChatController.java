package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.domain.game.GameRoomEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class ChatController {

    @MessageMapping("/create")
    public void createChat(@RequestBody GameRoomEntity gameRoomEntity){

        log.info("채팅방 {}이 생성되었습니다.",gameRoomEntity.getRoomId());

    }
}
