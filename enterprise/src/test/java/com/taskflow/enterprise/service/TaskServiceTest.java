package com.taskflow.enterprise.service;

import com.taskflow.enterprise.dto.request.TaskCreateRequest;
import com.taskflow.enterprise.dto.request.TaskStatusUpdateRequest;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.Task;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import com.taskflow.enterprise.exception.BusinessException;
import com.taskflow.enterprise.exception.ResourceNotFoundException;
import com.taskflow.enterprise.mapper.TaskMapper;
import com.taskflow.enterprise.repository.TaskRepository;
import com.taskflow.enterprise.service.impl.TaskServiceImpl; // Importação da implementação adicionada
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes unitarios da camada de servico {@link TaskServiceImpl}, isolando
 * a logica de negocio das dependencias de infraestrutura via Mockito.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService - Testes Unitarios")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService; // Alterado de TaskService (Interface) para TaskServiceImpl (Implementação física)

    private Task existingTask;
    private UUID taskId;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        existingTask = Task.builder()
                .id(taskId)
                .title("Implementar login")
                .description("Fluxo de autenticacao JWT")
                .status(TaskStatus.PENDING)
                .priority(TaskPriority.HIGH)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        @DisplayName("Deve criar uma tarefa com status PENDING, ignorando qualquer status do payload")
        void shouldCreateTaskWithPendingStatus() {
            TaskCreateRequest request = new TaskCreateRequest("Nova tarefa", "Descricao", TaskPriority.MEDIUM);
            Task mappedEntity = Task.builder().title("Nova tarefa").description("Descricao").priority(TaskPriority.MEDIUM).build();
            Task savedEntity = Task.builder()
                    .id(UUID.randomUUID())
                    .title("Nova tarefa")
                    .description("Descricao")
                    .status(TaskStatus.PENDING)
                    .priority(TaskPriority.MEDIUM)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            TaskResponse expectedResponse = new TaskResponse(
                    savedEntity.getId(), "Nova tarefa", "Descricao", TaskStatus.PENDING,
                    TaskPriority.MEDIUM, savedEntity.getCreatedAt(), savedEntity.getUpdatedAt());

            when(taskMapper.toEntity(request)).thenReturn(mappedEntity);
            when(taskRepository.save(any(Task.class))).thenReturn(savedEntity);
            when(taskMapper.toResponse(savedEntity)).thenReturn(expectedResponse);

            TaskResponse result = taskService.create(request);

            assertThat(result).isEqualTo(expectedResponse);
            assertThat(mappedEntity.getStatus()).isEqualTo(TaskStatus.PENDING);
            verify(taskRepository, times(1)).save(mappedEntity);
        }
    }

    @Nested
    @DisplayName("findById()")
    class FindById {

        @Test
        @DisplayName("Deve retornar a tarefa quando o id existir")
        void shouldReturnTaskWhenExists() {
            TaskResponse expectedResponse = new TaskResponse(
                    taskId, existingTask.getTitle(), existingTask.getDescription(),
                    existingTask.getStatus(), existingTask.getPriority(),
                    existingTask.getCreatedAt(), existingTask.getUpdatedAt());

            when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
            when(taskMapper.toResponse(existingTask)).thenReturn(expectedResponse);

            TaskResponse result = taskService.findById(taskId);

            assertThat(result).isEqualTo(expectedResponse);
        }

        @Test
        @DisplayName("Deve lancar ResourceNotFoundException quando o id nao existir")
        void shouldThrowWhenTaskDoesNotExist() {
            UUID unknownId = UUID.randomUUID();
            when(taskRepository.findById(unknownId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.findById(unknownId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining(unknownId.toString());
        }
    }

    @Nested
    @DisplayName("updateStatus()")
    class UpdateStatus {

        @Test
        @DisplayName("Deve impedir transicao de COMPLETED para PENDING")
        void shouldRejectInvalidStatusTransition() {
            existingTask.setStatus(TaskStatus.COMPLETED);
            when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));

            TaskStatusUpdateRequest request = new TaskStatusUpdateRequest(TaskStatus.PENDING);

            assertThatThrownBy(() -> taskService.updateStatus(taskId, request))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Nao e permitido");

            verify(taskRepository, never()).save(any(Task.class));
        }

        @Test
        @DisplayName("Deve permitir transicao valida de PENDING para IN_PROGRESS")
        void shouldAllowValidStatusTransition() {
            existingTask.setStatus(TaskStatus.PENDING);
            when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
            when(taskRepository.save(any(Task.class))).thenReturn(existingTask);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(
                    new TaskResponse(taskId, existingTask.getTitle(), existingTask.getDescription(),
                            TaskStatus.IN_PROGRESS, existingTask.getPriority(),
                            existingTask.getCreatedAt(), existingTask.getUpdatedAt()));

            TaskStatusUpdateRequest request = new TaskStatusUpdateRequest(TaskStatus.IN_PROGRESS);
            TaskResponse result = taskService.updateStatus(taskId, request);

            assertThat(result.status()).isEqualTo(TaskStatus.IN_PROGRESS);
            verify(taskRepository, times(1)).save(existingTask);
        }
    }

    @Nested
    @DisplayName("delete()")
    class Delete {

        @Test
        @DisplayName("Deve remover a tarefa quando ela existir")
        void shouldDeleteTaskWhenExists() {
            when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));

            taskService.delete(taskId);

            verify(taskRepository, times(1)).delete(existingTask);
        }

        @Test
        @DisplayName("Deve lancar ResourceNotFoundException ao tentar remover tarefa inexistente")
        void shouldThrowWhenDeletingNonExistentTask() {
            UUID unknownId = UUID.randomUUID();
            when(taskRepository.findById(unknownId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.delete(unknownId))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(taskRepository, never()).delete(any(Task.class));
        }
    }
}
