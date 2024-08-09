package com.tunapearl.saturi.domain.game.room;

import lombok.ToString;
import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;

@RedisHash("ChannelTopic")
@Getter
@Setter
@ToString
public class ChatRoom {

    @Id
    private String topicId;
    private long roomId;

    public static ChatRoom create() {
        ChatRoom topic = new ChatRoom();
        topic.topicId= UUID.randomUUID().toString();
        return topic;
    }
}
