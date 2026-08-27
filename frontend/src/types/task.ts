/**
 * Tipos de dominio da aplicacao TaskFlow. Espelham fielmente os DTOs
 * expostos pela API REST do backend Spring Boot.
 */

export const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT", // Certifique-se de incluir URGENT no seu enum Java correspondente
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreatePayload {
  title: string;
  description: string | null;
  priority: TaskPriority;
}

export interface TaskUpdatePayload {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
}

/**
 * Interface que espelha exatamente a paginação nativa (Page<T>) do Spring Data JPA
 */
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;   // Quantidade de itens por página vinda do Spring
  number: number; // Index da página atual (começa em 0 no Spring)
  empty: boolean;
}

export interface TaskFilters {
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  search: string;
  page: number;
  size: number;
}

/**
 * Formato RFC 7807 (Problem Details) ajustado com o seu GlobalExceptionHandler
 */
export interface ApiProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  fields?: Record<string, string>; // Alterado de errors para fields para bater com o Java
}

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ApiProblemDetail | null;

  constructor(status: number, problem: ApiProblemDetail | null, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}
