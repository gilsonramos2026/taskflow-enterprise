package com.taskflow.enterprise.service.impl;

import com.taskflow.enterprise.dto.request.TaskCreateRequest;
import com.taskflow.enterprise.dto.request.TaskStatusUpdateRequest;
import com.taskflow.enterprise.dto.request.TaskUpdateRequest;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.Task;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import com.taskflow.enterprise.exception.BusinessException;
import com.taskflow.enterprise.exception.ResourceNotFoundException;
import com.taskflow.enterprise.mapper.TaskMapper;
import com.taskflow.enterprise.repository.TaskRepository;
import com.taskflow.enterprise.repository.specification.TaskSpecifications;
import com.taskflow.enterprise.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementação concreta do serviço de tarefas gerenciada pelo Spring Boot.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Override
    public Page<TaskResponse> findAll(TaskStatus status, TaskPriority priority, String search, Pageable pageable) {
        log.debug("Buscando tarefas com filtros - status: {}, priority: {}, search: {}", status, priority, search);

        return taskRepository
                .findAll(TaskSpecifications.withFilters(status, priority, search), pageable)
                .map(taskMapper::toResponse);
    }

    @Override
    public TaskResponse findById(UUID id) {
        Task task = getTaskOrThrow(id);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse create(TaskCreateRequest request) {
        Task task = taskMapper.toEntity(request);
        task.setStatus(TaskStatus.PENDING);

        Task savedTask = taskRepository.save(task);
        log.info("Tarefa criada com sucesso. id={}", savedTask.getId());

        return taskMapper.toResponse(savedTask);
    }

    @Override
    @Transactional
    public TaskResponse update(UUID id, TaskUpdateRequest request) {
        Task task = getTaskOrThrow(id);

        validateStatusTransition(task.getStatus(), request.status());

        taskMapper.updateEntityFromRequest(request, task);
        Task updatedTask = taskRepository.save(task);

        log.info("Tarefa atualizada com sucesso. id={}", updatedTask.getId());
        return taskMapper.toResponse(updatedTask);
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(UUID id, TaskStatusUpdateRequest request) {
        Task task = getTaskOrThrow(id);

        validateStatusTransition(task.getStatus(), request.status());

        task.setStatus(request.status());
        Task updatedTask = taskRepository.save(task);

        log.info("Status da tarefa {} alterado para {}", id, request.status());
        return taskMapper.toResponse(updatedTask);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Task task = getTaskOrThrow(id);
        taskRepository.delete(task);
        log.info("Tarefa removida com sucesso. id={}", id);
    }

    private Task getTaskOrThrow(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forTask(id));
    }

    private void validateStatusTransition(TaskStatus currentStatus, TaskStatus newStatus) {
        if (currentStatus == TaskStatus.COMPLETED && newStatus == TaskStatus.PENDING) {
            throw new BusinessException(
                    "Nao e permitido mover uma tarefa concluida diretamente de volta para PENDING. " +
                            "Utilize IN_PROGRESS como etapa intermediaria."
            );
        }
    }
}
