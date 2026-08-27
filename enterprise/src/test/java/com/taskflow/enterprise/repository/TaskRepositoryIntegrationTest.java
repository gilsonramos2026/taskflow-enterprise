package com.taskflow.enterprise.repository;

import com.taskflow.enterprise.entity.Task;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import com.taskflow.enterprise.repository.specification.TaskSpecifications;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Teste de integracao da camada de persistencia utilizando banco em memoria (H2),
 * validando o comportamento real de filtros dinamicos de maneira isolada e livre de Docker.
 */
@DataJpaTest // Configura e limpa o banco automaticamente a cada execução de teste
@DisplayName("TaskRepository - Testes de Integração")
class TaskRepositoryIntegrationTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    @DisplayName("Deve filtrar tarefas por status e prioridade combinados")
    void shouldFilterTasksByStatusAndPriority() {
        taskRepository.save(Task.builder()
                .title("Corrigir bug critico")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.URGENT)
                .build());

        taskRepository.save(Task.builder()
                .title("Escrever documentacao")
                .status(TaskStatus.PENDING)
                .priority(TaskPriority.LOW)
                .build());

        var result = taskRepository.findAll(
                TaskSpecifications.withFilters(TaskStatus.IN_PROGRESS, TaskPriority.URGENT, null),
                PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Corrigir bug critico");
    }

    @Test
    @DisplayName("Deve buscar tarefas por texto no titulo ou descricao")
    void shouldSearchTasksByText() {
        taskRepository.save(Task.builder()
                .title("Implementar autenticacao JWT")
                .description("Fluxo completo de login")
                .status(TaskStatus.PENDING)
                .priority(TaskPriority.HIGH)
                .build());

        var result = taskRepository.findAll(
                TaskSpecifications.withFilters(null, null, "autenticacao"),
                PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
    }
}
