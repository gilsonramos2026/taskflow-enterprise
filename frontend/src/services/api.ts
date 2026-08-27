import {
  ApiError,
  type ApiProblemDetail,
  type PagedResponse,
  type Task,
  type TaskCreatePayload,
  type TaskFilters,
  type TaskUpdatePayload,
} from "../types/task";

// Ajustado para apontar diretamente para a porta e rota do seu Spring Boot
const API_BASE_URL = "/api/v1/tasks";

/**
 * Wrapper central para todas as requisicoes HTTP da aplicacao.
 * Padroniza o parsing de erros no formato RFC 7807 (Problem Details).
 */
async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json") || contentType.includes("application/problem+json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const problem = body as ApiProblemDetail | null;
    const message = problem?.detail ?? problem?.title ?? `Erro inesperado (HTTP ${response.status})`;
    throw new ApiError(response.status, problem, message);
  }

  return body as T;
}

function buildQueryString(filters: Partial<TaskFilters>): string {
  const params = new URLSearchParams();

  // Garante que valores vazios ou "ALL" não sejam enviados para o Spring Boot
  if (filters.status && filters.status !== "ALL") {
    params.set("status", filters.status);
  }
  if (filters.priority && filters.priority !== "ALL") {
    params.set("priority", filters.priority);
  }
  if (filters.search && filters.search.trim() !== "") {
    params.set("search", filters.search.trim());
  }
  if (typeof filters.page === "number") {
    params.set("page", String(filters.page));
  }
  if (typeof filters.size === "number") {
    params.set("size", String(filters.size));
  }
  params.set("sort", "createdAt,desc");

  return params.toString();
}

export const taskApi = {
  async list(filters: Partial<TaskFilters>): Promise<PagedResponse<Task>> {
    const query = buildQueryString(filters);
    return request<PagedResponse<Task>>(`${API_BASE_URL}?${query}`);
  },

  async getById(id: string): Promise<Task> {
    return request<Task>(`${API_BASE_URL}/${id}`);
  },

  async create(payload: TaskCreatePayload): Promise<Task> {
    return request<Task>(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: TaskUpdatePayload): Promise<Task> {
    return request<Task>(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(id: string, status: Task["status"]): Promise<Task> {
    return request<Task>(`${API_BASE_URL}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async remove(id: string): Promise<void> {
    await request<void>(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
