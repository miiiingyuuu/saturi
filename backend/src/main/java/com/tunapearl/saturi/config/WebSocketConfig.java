package com.tunapearl.saturi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //처음 Handshake를 위한 경로
        registry.addEndpoint("/game")//엔트포인트
                .setAllowedOrigins("*");

        registry.addEndpoint("/game")
                .setAllowedOrigins("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //메세지 구독 요청 url
        registry.enableSimpleBroker("/sub");
        //메세지 발행 요청 url, 메시지 보낼때, @MessageMapping 메서드로 라우팅
        registry.setApplicationDestinationPrefixes("/pub");
    }
}
