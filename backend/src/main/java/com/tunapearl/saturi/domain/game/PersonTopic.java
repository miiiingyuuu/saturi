package com.tunapearl.saturi.domain.game;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;

@RedisHash("PersonTopic")
@Getter
@Setter
public class PersonTopic {

    @Id
    private String personTopicId;
    private Long userId;

    public static PersonTopic create(long userId) {
        PersonTopic topic = new PersonTopic();
        topic.setUserId(userId);
        topic.personTopicId= UUID.randomUUID().toString();
        return topic;
    }
}
