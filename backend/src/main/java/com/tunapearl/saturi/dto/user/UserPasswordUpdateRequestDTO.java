package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserPasswordUpdateRequestDTO {
    private String currentPassword;
    private String newPassword;
}
