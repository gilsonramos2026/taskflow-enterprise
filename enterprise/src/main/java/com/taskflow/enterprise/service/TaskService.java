package com.taskflow.enterprise.service;


import com.taskflow.enterprise.dto.request.TaskCreateRequest;
import com.taskflow.enterprise.dto.request.TaskStatusUpdateRequest;
import com.taskflow.enterprise.dto.request.TaskUpdateRequest;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Interface que define o contrato de operações de negócio para tarefas.
 */

public interface TaskService {

    Page<TaskResponse> findAll(TaskStatus status, TaskPriority priority, String search, Pageable pageable);

    TaskResponse findById(UUID id);

    TaskResponse create(TaskCreateRequest request);

    TaskResponse update(UUID id, TaskUpdateRequest request);

    TaskResponse updateStatus(UUID id, TaskStatusUpdateRequest request);

    void delete(UUID id);
}
