package com.taskflow.enterprise.repository.specification;

import com.taskflow.enterprise.entity.Task;
import com.taskflow.enterprise.entity.enums.TaskPriority;
import com.taskflow.enterprise.entity.enums.TaskStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Fabrica de {@link Specification}s reutilizaveis para filtragem dinamica
 * de tarefas, evitando a explosao de metodos derivados no repositorio.
 */
public final class TaskSpecifications {

    private TaskSpecifications() {
        // Construtor privado para evitar instanciação de classe utilitária
    }

    public static Specification<Task> hasStatus(TaskStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Task> hasPriority(TaskPriority priority) {
        return (root, query, cb) -> priority == null ? null : cb.equal(root.get("priority"), priority);
    }

    public static Specification<Task> titleContains(String search) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(search)) {
                return null;
            }
            String likePattern = "%" + search.strip().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern)
            );
        };
    }

    /**
     * Combina os filtros dinamicamente usando Specification.where().
     * Evita erros de ponteiro nulo (NPE) comuns ao usar allOf com argumentos vazios.
     */
    public static Specification<Task> withFilters(TaskStatus status, TaskPriority priority, String search) {
        return Specification.where(hasStatus(status))
                .and(hasPriority(priority))
                .and(titleContains(search));
    }
}
