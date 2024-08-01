package com.tunapearl.saturi.exception;

public class UnAuthorizedUserException extends RuntimeException {
    public UnAuthorizedUserException() {
        super();
    }

    public UnAuthorizedUserException(String message) {
        super(message);
    }

    public UnAuthorizedUserException(String message, Throwable cause) {
        super(message, cause);
    }

    public UnAuthorizedUserException(Throwable cause) {
        super(cause);
    }

    protected UnAuthorizedUserException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
