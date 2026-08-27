package com.taskflow.enterprise.dto.response;

import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Payload de saida representando uma tarefa.
 */

@Schema(description = "Representacao de uma tarefa retornada pela API")
public record TaskResponse(

        @Schema(description = "Identificador unico da tarefa")
        UUID id,

        @Schema(description = "Titulo da tarefa")
        String title,

        @Schema(description = "Descricao da tarefa")
        String description,

        @Schema(description = "Status atual")
        TaskStatus status,

        @Schema(description = "Prioridade")
        TaskPriority priority,

        @Schema(description = "Data de criacao")
        LocalDateTime createdAt,

        @Schema(description = "Data da ultima atualizacao")
        LocalDateTime updatedAt
) {
}
