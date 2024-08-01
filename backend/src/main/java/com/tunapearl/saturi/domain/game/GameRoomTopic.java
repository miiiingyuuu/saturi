package com.tunapearl.saturi.domain.game;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;

@RedisHash("GameRoomTopic")
@Getter
@Setter
public class GameRoomTopic {

    @Id
    private String topicId;
    private Long roomId;

    public static GameRoomTopic create(long roomId) {
        GameRoomTopic topic = new GameRoomTopic();
        topic.setRoomId(roomId);
        topic.topicId= UUID.randomUUID().toString();
        return topic;
    }
}
