package com.taskflow.enterprise.mapper;

import com.taskflow.enterprise.dto.request.TaskCreateRequest;
import com.taskflow.enterprise.dto.request.TaskUpdateRequest;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.Task;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-25T16:57:11-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Oracle Corporation)"
)
@Component
public class TaskMapperImpl implements TaskMapper {

    @Override
    public TaskResponse toResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        UUID id = null;
        String title = null;
        String description = null;
        TaskStatus status = null;
        TaskPriority priority = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        id = task.getId();
        title = task.getTitle();
        description = task.getDescription();
        status = task.getStatus();
        priority = task.getPriority();
        createdAt = task.getCreatedAt();
        updatedAt = task.getUpdatedAt();

        TaskResponse taskResponse = new TaskResponse( id, title, description, status, priority, createdAt, updatedAt );

        return taskResponse;
    }

    @Override
    public Task toEntity(TaskCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Task.TaskBuilder task = Task.builder();

        task.title( request.title() );
        task.description( request.description() );
        task.priority( request.priority() );

        return task.build();
    }

    @Override
    public void updateEntityFromRequest(TaskUpdateRequest request, Task task) {
        if ( request == null ) {
            return;
        }

        if ( request.title() != null ) {
            task.setTitle( request.title() );
        }
        if ( request.description() != null ) {
            task.setDescription( request.description() );
        }
        if ( request.status() != null ) {
            task.setStatus( request.status() );
        }
        if ( request.priority() != null ) {
            task.setPriority( request.priority() );
        }
    }
}
