package com.tunapearl.saturi.exception;

public class AlreadyMaxSizeException extends IllegalStateException {
    public AlreadyMaxSizeException() {
        super();
    }

    public AlreadyMaxSizeException(String s) {
        super(s);
    }

    public AlreadyMaxSizeException(String message, Throwable cause) {
        super(message, cause);
    }

    public AlreadyMaxSizeException(Throwable cause) {
        super(cause);
    }
}
