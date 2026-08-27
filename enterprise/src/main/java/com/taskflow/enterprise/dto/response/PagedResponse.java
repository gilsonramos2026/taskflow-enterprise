package com.taskflow.enterprise.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Envelope generico para respostas paginadas, desacoplado do tipo
 * {@link org.springframework.data.domain.Page} do Spring Data para nao
 * vazar detalhes de infraestrutura na camada de API.
 */

@Schema(description = "Envelope de resposta paginada")
public record PagedResponse<T>(

        @Schema(description = "Conteudo da pagina atual")
        List<T> content,

        @Schema(description = "Numero da pagina atual (zero-indexed)")
        int pageNumber,

        @Schema(description = "Quantidade de itens por pagina")
        int pageSize,

        @Schema(description = "Total de elementos encontrados")
        long totalElements,

        @Schema(description = "Total de paginas")
        int totalPages,

        @Schema(description = "Indica se e a ultima pagina")
        boolean last
) {
    public static <T> PagedResponse<T> from(Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
