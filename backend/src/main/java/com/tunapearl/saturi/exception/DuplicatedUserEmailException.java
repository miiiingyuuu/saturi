package com.tunapearl.saturi.exception;

public class DuplicatedUserEmailException extends IllegalStateException {
    public DuplicatedUserEmailException() {
        super();
    }
    public DuplicatedUserEmailException(String message) {
        super(message);
    }
    public DuplicatedUserEmailException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicatedUserEmailException(Throwable cause) {
        super(cause);
    }
}
