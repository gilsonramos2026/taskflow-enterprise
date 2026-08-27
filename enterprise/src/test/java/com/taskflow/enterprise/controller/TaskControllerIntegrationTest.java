package com.taskflow.enterprise.controller;

import static org.hamcrest.Matchers.containsString; //  ADICIONE ESTE IMPORT
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.enterprise.dto.request.TaskCreateRequest;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import com.taskflow.enterprise.exception.ResourceNotFoundException;
import com.taskflow.enterprise.service.TaskService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes de integracao da camada web (Controller) utilizando MockMvc.
 * O contexto Spring e carregado de forma restrita (apenas a camada web)
 * e a camada de servico e mockada, isolando o teste do banco de dados real.
 */
@WebMvcTest(TaskController.class)
@DisplayName("TaskController - Testes de Integracao (MockMvc)")
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TaskService taskService;

    @Test
    @DisplayName("GET /api/v1/tasks deve retornar 200 com lista paginada")
    void shouldReturnPagedTasks() throws Exception {
        TaskResponse taskResponse = new TaskResponse(
                UUID.randomUUID(), "Tarefa 1", "Descricao", TaskStatus.PENDING,
                TaskPriority.MEDIUM, LocalDateTime.now(), LocalDateTime.now());

        Page<TaskResponse> page = new PageImpl<>(List.of(taskResponse), PageRequest.of(0, 10), 1);

        when(taskService.findAll(any(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Tarefa 1"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/tasks/{id} deve retornar 404 quando a tarefa nao existir")
    void shouldReturn404WhenTaskNotFound() throws Exception {
        UUID unknownId = UUID.randomUUID();
        when(taskService.findById(unknownId)).thenThrow(ResourceNotFoundException.forTask(unknownId));

        mockMvc.perform(get("/api/v1/tasks/{id}", unknownId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found")) // Sincronizado com GlobalExceptionHandler
                .andExpect(jsonPath("$.message").value(containsString(unknownId.toString()))); //  CORRIGIDO AQUI
    }


    @Test
    @DisplayName("POST /api/v1/tasks deve retornar 201 ao criar tarefa valida")
    void shouldCreateTaskSuccessfully() throws Exception {
        TaskCreateRequest request = new TaskCreateRequest("Nova tarefa", "Descricao valida", TaskPriority.HIGH);
        TaskResponse response = new TaskResponse(
                UUID.randomUUID(), "Nova tarefa", "Descricao valida", TaskStatus.PENDING,
                TaskPriority.HIGH, LocalDateTime.now(), LocalDateTime.now());

        when(taskService.create(any(TaskCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.title").value("Nova tarefa"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("POST /api/v1/tasks deve retornar 422 quando o titulo estiver ausente")
    void shouldReturn422WhenTitleIsMissing() throws Exception {
        TaskCreateRequest invalidRequest = new TaskCreateRequest("", "Descricao", TaskPriority.LOW);

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isUnprocessableEntity()) // Ajustado para bater com o ResponseEntity.unprocessableEntity()
                .andExpect(jsonPath("$.error").value("Erro de Validação")) // Sincronizado com o seu ExceptionHandler
                .andExpect(jsonPath("$.fields.title").exists()); // Ajustado de errors para fields
    }

    @Test
    @DisplayName("DELETE /api/v1/tasks/{id} deve retornar 204 ao remover com sucesso")
    void shouldDeleteTaskSuccessfully() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/tasks/{id}", id))
                .andExpect(status().isNoContent());
    }
}
