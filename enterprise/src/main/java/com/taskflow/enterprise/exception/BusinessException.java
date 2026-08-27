package com.taskflow.enterprise.exception;

/**
 * Lancada quando uma regra de negocio e violada.
 */

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
