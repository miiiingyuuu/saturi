package com.tunapearl.saturi.service;

import com.tunapearl.saturi.dto.lesson.SaveLessonGraphResponseDTO;
import com.tunapearl.saturi.dto.user.ChatBotRequestDTO;
import com.tunapearl.saturi.dto.user.ChatBotResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ChatBotService {

    public String requestChatBot(String clovaApiKey, String clovaGwKey, String clovaRequestKey, String content) {
        RestTemplate restTemplate = new RestTemplate();

        // json data
        Map<String, List<ChatBotRequestDTO>> requestBody = new HashMap<>();
        List<ChatBotRequestDTO> chatBotRequests = new ArrayList<>();
        chatBotRequests.add(new ChatBotRequestDTO("user", content));
        requestBody.put("messages", chatBotRequests);

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-NCP-CLOVASTUDIO-API-KEY", clovaApiKey);
        headers.set("X-NCP-APIGW-API-KEY", clovaGwKey);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", clovaRequestKey);

        // 요청 엔티티 생성
        HttpEntity<Map<String, List<ChatBotRequestDTO>>> requestEntity = new HttpEntity<>(requestBody, headers);

        // REST API 호출
        String url = "https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003";
        ResponseEntity<ChatBotResponseDTO> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, ChatBotResponseDTO.class);

        // 응답 처리
        if(response.getStatusCode().is2xxSuccessful()) {
            return response.getBody().getResult().getMessage().getContent();
        } else {
            throw new IllegalArgumentException("챗봇 요청에 문제가 발생하였습니다");
        }
    }
}
