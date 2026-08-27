package com.taskflow.enterprise.repository;

import com.taskflow.enterprise.entity.Task; // Importação corrigida para apontar para sua Entidade JPA
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.UUID;

/**
 * Repositorio Spring Data JPA para a entidade {@link Task}.
 * Estende {@link JpaSpecificationExecutor} para permitir consultas
 * dinamicas com filtros combinaveis (status, prioridade, texto de busca).
 */
public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
}
