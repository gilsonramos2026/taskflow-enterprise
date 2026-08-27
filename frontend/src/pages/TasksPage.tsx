import { ListTodo } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { Pagination } from "../components/Pagination";
import { TaskFiltersBar } from "../components/TaskFiltersBar";
import { TaskFormModal, type TaskFormValues } from "../components/TaskFormModal";
import { TaskGrid } from "../components/TaskGrid";
import { ToastContainer } from "../components/ToastContainer";
import { useTasks } from "../hooks/useTasks";
import { useToast } from "../hooks/useToast";
import { taskApi } from "../services/api";
import { ApiError, type Task } from "../types/task";

export function TasksPage() {
  const { tasks, pagination, filters, isLoading, errorMessage, setFilters, reload } = useTasks();
  const toast = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreateForm() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSubmitting) return;
    setIsFormOpen(false);
    setEditingTask(null);
  }

  async function handleFormSubmit(values: TaskFormValues) {
    setIsSubmitting(true);
    try {
      const description = values.description.trim().length > 0 ? values.description.trim() : null;

      if (editingTask) {
        await taskApi.update(editingTask.id, {
          title: values.title.trim(),
          description,
          status: values.status,
          priority: values.priority,
        });
        toast.success("Tarefa atualizada com sucesso.");
      } else {
        await taskApi.create({
          title: values.title.trim(),
          description,
          priority: values.priority,
        });
        toast.success("Tarefa criada com sucesso.");
      }

      setIsFormOpen(false);
      setEditingTask(null);
      reload();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Nao foi possivel salvar a tarefa.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(task: Task, status: Task["status"]) {
    try {
      await taskApi.updateStatus(task.id, status);
      toast.success(`Status de "${task.title}" atualizado.`);
      reload();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Nao foi possivel atualizar o status.";
      toast.error(message);
    }
  }

  async function handleConfirmDelete() {
    if (!taskPendingDeletion) return;

    setIsDeleting(true);
    try {
      await taskApi.remove(taskPendingDeletion.id);
      toast.success("Tarefa excluida com sucesso.");
      setTaskPendingDeletion(null);
      reload();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Nao foi possivel excluir a tarefa.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
            <ListTodo className="h-5 w-5 text-white" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-800">TaskFlow Enterprise</h1>
            <p className="text-sm text-slate-400">Gestao de Tarefas e Projetos</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <TaskFiltersBar filters={filters} onChange={setFilters} onCreateClick={openCreateForm} />
        </div>

        <TaskGrid
          tasks={tasks}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onEdit={openEditForm}
          onDelete={setTaskPendingDeletion}
          onStatusChange={handleStatusChange}
        />

        {pagination && (
          <div className="mt-6">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters((previous) => ({ ...previous, page }))}
            />
          </div>
        )}
      </main>

      <TaskFormModal
        isOpen={isFormOpen}
        task={editingTask}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        task={taskPendingDeletion}
        isDeleting={isDeleting}
        onCancel={() => setTaskPendingDeletion(null)}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}
