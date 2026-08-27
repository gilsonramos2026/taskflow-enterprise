package com.taskflow.enterprise.dto.request;

import com.taskflow.enterprise.entity.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * Payload de entrada para atualizacao parcial (apenas o status) de uma tarefa.
 */

@Schema(description = "Novo status a ser aplicado a tarefa")
public record TaskStatusUpdateRequest(
        @Schema(description = "Novo status da tarefa", example = "COMPLETED")
        @NotNull(message = "O status e obrigatorio")
        TaskStatus status
) {
}
