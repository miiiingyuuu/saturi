package com.tunapearl.saturi.service.user;

import com.tunapearl.saturi.dto.user.social.SocialAuthResponseDTO;
import com.tunapearl.saturi.dto.user.social.SocialUserResponseDTO;
import com.tunapearl.saturi.dto.user.UserType;
import com.tunapearl.saturi.exception.InvalidTokenException;

public interface SocialLoginService {
    UserType getServiceName();
    SocialAuthResponseDTO getAccessToken(String code);
    void checkTokenValidity(String accessToken) throws InvalidTokenException, RuntimeException;
    SocialAuthResponseDTO refreshAccessToken(String refreshToken);
    SocialUserResponseDTO getUserInfo(String accessToken);
}
