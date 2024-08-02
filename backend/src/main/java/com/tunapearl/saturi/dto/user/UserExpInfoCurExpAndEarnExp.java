package com.tunapearl.saturi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserExpInfoCurExpAndEarnExp {
    private Long currentExp;
    private Long earnExp;
    private Long resultExp;
}
