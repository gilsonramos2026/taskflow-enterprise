import { useCallback, useEffect, useState } from "react";
import { taskApi } from "../services/api";
import { ApiError, type PagedResponse, type Task, type TaskFilters } from "../types/task";

const DEFAULT_FILTERS: TaskFilters = {
  status: "ALL",
  priority: "ALL",
  search: "",
  page: 0,
  size: 8,
};

interface UseTasksResult {
  tasks: Task[];
  pagination: Omit<PagedResponse<Task>, "content"> | null;
  filters: TaskFilters;
  isLoading: boolean;
  errorMessage: string | null;
  setFilters: (updater: (previous: TaskFilters) => TaskFilters) => void;
  reload: () => void;
}

/**
 * Encapsula o carregamento paginado/filtrado de tarefas, incluindo estados
 * de loading e erro, para manter os componentes de UI enxutos.
 */
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Omit<PagedResponse<Task>, "content"> | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const setFilters = useCallback((updater: (previous: TaskFilters) => TaskFilters) => {
    setFiltersState(updater);
  }, []);

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchTasks() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await taskApi.list(filters);
        if (!isCancelled) {
          setTasks(response.content);
          setPagination({
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last,
            first: response.first,
            size: response.size,     // Mapeado padrão Spring Boot
            number: response.number, // Mapeado padrão Spring Boot
            empty: response.empty,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          const message = error instanceof ApiError ? error.message : "Falha ao carregar as tarefas.";
          setErrorMessage(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchTasks();

    return () => {
      isCancelled = true;
    };
  }, [filters, reloadToken]);

  return { tasks, pagination, filters, isLoading, errorMessage, setFilters, reload };
}
