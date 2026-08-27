package com.taskflow.enterprise.dto.request;

import com.taskflow.enterprise.entity.enums.TaskPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Payload de entrada para criacao de uma nova tarefa.
 */

@Schema(description = "Dados necessarios para criar uma nova tarefa")
public record TaskCreateRequest(

        @Schema(description = "Titulo da tarefa", example = "Implementar autenticacao JWT")
        @NotBlank(message = "O titulo e obrigatorio")
        @Size(min = 3, max = 150, message = "O titulo deve ter entre 3 e 150 caracteres")
        String title,

        @Schema(description = "Descricao detalhada da tarefa", example = "Adicionar fluxo de login/refresh token")
        @Size(max = 2000, message = "A descricao deve ter no maximo 2000 caracteres")
        String description,

        @Schema(description = "Prioridade da tarefa", example = "HIGH")
        @NotNull(message = "A prioridade e obrigatoria")
        TaskPriority priority
) {
}
