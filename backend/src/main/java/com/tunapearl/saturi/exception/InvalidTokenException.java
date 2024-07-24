package com.tunapearl.saturi.exception;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException() {
        super();
    }

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException(String msg, String accessToken) {
        super(String.format("Invalid access token: %s", accessToken));
    }
}
