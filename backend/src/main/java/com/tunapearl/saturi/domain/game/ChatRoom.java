package com.tunapearl.saturi.domain.game;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;

@RedisHash("ChatRoom")
@Getter
@Setter
public class ChatRoom {

    @Id
    private String roomId;

    public static ChatRoom create() {
        ChatRoom topic = new ChatRoom();
        topic.roomId= UUID.randomUUID().toString();
        return topic;
    }
}
