package com.tunapearl.saturi.exception.advice;

import com.tunapearl.saturi.controller.UserController;
import com.tunapearl.saturi.dto.error.ErrorResponseDTO;
import com.tunapearl.saturi.exception.UnAuthorizedException;
import com.tunapearl.saturi.exception.UnAuthorizedUserException;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
//@RestControllerAdvice(assignableTypes = {UserController.class}) // 대상 컨트롤러 지정 가능
public class ExControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalStateException.class)
    public ErrorResponseDTO IllegalStateExHandle(IllegalStateException e) {
        log.error("[exceptionHandle] ex", e);
        return new ErrorResponseDTO("BAD_REQUEST", e.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResponseDTO IllegalArgumentExHandle(IllegalArgumentException e) {
        log.error("[exceptionHandle] ex", e);
        return new ErrorResponseDTO("BAD_REQUEST", e.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnAuthorizedException.class)
    public ErrorResponseDTO UnAuthorizedExHandle(UnAuthorizedException e) {
        log.error("[exceptionHandle] ex", e);
        return new ErrorResponseDTO("UNAUTHORIZED", e.getMessage());
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(MessagingException.class)
    public ErrorResponseDTO MessagingExHandle(MessagingException e) {
        log.error("[exceptionHandle] ex", e);
        return new ErrorResponseDTO("FORBIDDEN", e.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ErrorResponseDTO ExHandle(Exception e) {
        log.error("[exceptionHandle] ex", e);
        return new ErrorResponseDTO("INTER_SERVER_ERROR", "서버 내부 오류");
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnAuthorizedUserException.class)
    public ErrorResponseDTO UnAuthorizeUserHandle(UnAuthorizedUserException e) {
        log.error("[exceptionHandle] ex", e);
        return new ErrorResponseDTO("UNAUTHORIZED", "관리자 아님");
    }
}
