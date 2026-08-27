package com.taskflow.enterprise.mapper;

import com.taskflow.enterprise.dto.request.TaskCreateRequest; // Importação necessária
import com.taskflow.enterprise.dto.request.TaskUpdateRequest;
import com.taskflow.enterprise.dto.response.TaskResponse;
import com.taskflow.enterprise.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper responsavel por converter entre a entidade {@link Task} e seus
 * respectivos DTOs de entrada/saida. Toda a logica de mapeamento e gerada
 * automaticamente pelo MapStruct em tempo de compilacao.
 */
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface TaskMapper {

    /**
     * Converte a entidade Task para o record de resposta TaskResponse.
     */
    TaskResponse toResponse(Task task);

    /**
     * Converte o payload de criação em uma nova entidade Task.
     * (Adicionado para atender à linha 53 do seu TaskService)
     */
    Task toEntity(TaskCreateRequest request);

    /**
     * Atualiza uma entidade existente com os dados do payload de update,
     * preservando id, createdAt e demais campos gerenciados pela entidade.
     */
    void updateEntityFromRequest(TaskUpdateRequest request, @MappingTarget Task task);
}
