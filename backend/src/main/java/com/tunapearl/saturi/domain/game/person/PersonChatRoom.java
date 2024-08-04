package com.tunapearl.saturi.domain.game.person;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;

@RedisHash("PersonTopic")
@Getter
@Setter
public class PersonChatRoom {

    @Id
    private String personchatroomId;

    private long userId;

    public static PersonChatRoom create(long userId) {
        PersonChatRoom topic = new PersonChatRoom();
        topic.personchatroomId = UUID.randomUUID().toString();
        return topic;
    }
}
