package com.tunapearl.saturi.dto.user.social;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PublicKeyResponseDTO {
    private List<Key> keys;

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    public static class Key {
        private String kid;
        private String kty;
        private String alg;
        private String use;
        private String n;
        private String e;
    }
}