package com.tunapearl.saturi.domain;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {

    @Id
    @GeneratedValue
    private long userId;
    private String email;

    @Override
    public String toString() {
        return "User{" +
                "user_id=" + userId +
                ", email='" + email + '\'' +
                '}';
    }
}
