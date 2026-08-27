import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PagedResponse, Task } from "../types/task";

interface PaginationProps {
  pagination: Omit<PagedResponse<Task>, "content">;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  // Ajustado para usar 'number' e 'size' vindos da paginação nativa do Spring Boot
  const { number: pageNumber = 0, totalPages = 0, totalElements = 0, size: pageSize = 0 } = pagination;

  if (totalElements === 0) {
    return null;
  }

  const firstItem = pageNumber * pageSize + 1;
  const lastItem = Math.min(firstItem + pageSize - 1, totalElements);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-1 pt-4 sm:flex-row">
      <p className="text-sm text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{firstItem}</span>-
        <span className="font-medium text-slate-700">{lastItem}</span> de{" "}
        <span className="font-medium text-slate-700">{totalElements}</span> tarefas
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber === 0}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-2 text-sm text-slate-600">
          Pagina <span className="font-medium">{pageNumber + 1}</span> de{" "}
          <span className="font-medium">{Math.max(totalPages, 1)}</span>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pagination.last}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Proxima pagina"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
