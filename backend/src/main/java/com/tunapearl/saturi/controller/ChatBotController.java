package com.tunapearl.saturi.controller;

import com.tunapearl.saturi.service.ChatBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatBotController {

    private final ChatBotService chatBotService;

    @PostMapping
    public ResponseEntity<?> requestChatBot(@RequestHeader("X-NCP-CLOVASTUDIO-API-KEY") String clovaApiKey,
                                            @RequestHeader("X-NCP-APIGW-API-KEY") String clovaGwKey,
                                            @RequestHeader("X-NCP-CLOVASTUDIO-REQUEST-ID") String clovaRequestKey,
                                            @RequestBody String content) {

        return ResponseEntity.ok(chatBotService.requestChatBot(clovaApiKey, clovaGwKey, clovaRequestKey, content));
    }
}
