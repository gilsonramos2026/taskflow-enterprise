package com.taskflow.enterprise.controller;

import com.taskflow.enterprise.dto.request.TaskCreateRequest;
import com.taskflow.enterprise.dto.request.TaskStatusUpdateRequest;
import com.taskflow.enterprise.dto.request.TaskUpdateRequest;
import com.taskflow.enterprise.dto.response.PagedResponse;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import com.taskflow.enterprise.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

/**
 * Controller REST responsavel pelos endpoints de gerenciamento de tarefas.
 * Apenas orquestra a requisicao/resposta; toda a regra de negocio vive na
 * camada de servico.
 */

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints para gerenciamento de tarefas")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Lista tarefas paginadas", description = "Retorna uma lista paginada de tarefas, com filtros opcionais por status, prioridade e busca textual.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<PagedResponse<TaskResponse>> findAll(
            @Parameter(description = "Filtra pelo status da tarefa") @RequestParam(required = false) TaskStatus status,
            @Parameter(description = "Filtra pela prioridade da tarefa") @RequestParam(required = false) TaskPriority priority,
            @Parameter(description = "Busca textual em titulo/descricao") @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        Page<TaskResponse> page = taskService.findAll(status, priority, search, pageable);
        return ResponseEntity.ok(PagedResponse.from(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma tarefa pelo id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa encontrada"),
            @ApiResponse(responseCode = "404", description = "Tarefa nao encontrada")
    })
    public ResponseEntity<TaskResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Cria uma nova tarefa")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tarefa criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados invalidos")
    })
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskCreateRequest request) {
        TaskResponse createdTask = taskService.create(request);
        URI location = URI.create("/api/v1/tasks/" + createdTask.id());
        return ResponseEntity.created(location).body(createdTask);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza integralmente uma tarefa existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa nao encontrada"),
            @ApiResponse(responseCode = "422", description = "Transicao de status invalida")
    })
    public ResponseEntity<TaskResponse> update(
            @PathVariable UUID id, @Valid @RequestBody TaskUpdateRequest request) {
        return ResponseEntity.ok(taskService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualiza apenas o status de uma tarefa")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa nao encontrada"),
            @ApiResponse(responseCode = "422", description = "Transicao de status invalida")
    })
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable UUID id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        return ResponseEntity.ok(taskService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove uma tarefa")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tarefa removida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa nao encontrada")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        taskService.delete(id);
    }
}
