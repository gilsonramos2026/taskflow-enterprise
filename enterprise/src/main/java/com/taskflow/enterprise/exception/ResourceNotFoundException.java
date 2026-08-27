package com.taskflow.enterprise.exception;

/**
 * Lancada quando um recurso solicitado nao e encontrado no banco de dados.
 */

public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException forTask(Object id) {
        return new ResourceNotFoundException("Tarefa nao encontrada com o id: " + id);
    }
}
