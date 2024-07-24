package com.tunapearl.saturi.exception;

public class DuplicatedUserNicknameException extends IllegalStateException{
    public DuplicatedUserNicknameException() {
        super();
    }
    public DuplicatedUserNicknameException(String message) {
        super(message);
    }
    public DuplicatedUserNicknameException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicatedUserNicknameException(Throwable cause) {
        super(cause);
    }
}
