package com.tunapearl.saturi.domain.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "Email", timeToLive = 60*5)//초단위이므로 5분
@AllArgsConstructor
@Getter
@Setter
public class RedisEmail {

    @Id
    private String email;
    private String authNum;
}
