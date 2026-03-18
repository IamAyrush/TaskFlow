import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchTasksThunk, createTaskThunk, updateTaskThunk, deleteTaskThunk, setFilter } from '../../store/tasksSlice';
import type { Task, TaskStatus, CreateTaskPayload } from '../../types';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

const FILTER_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error, filter } = useAppSelector(state => state.tasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  }, [tasks, filter]);

  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  const handleCreate = () => { setEditingTask(undefined); setModalOpen(true); };
  const handleEdit = (task: Task) => { setEditingTask(task); setModalOpen(true); };
  const handleDelete = (id: string) => { dispatch(deleteTaskThunk(id)); };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    dispatch(updateTaskThunk({ id, title: task.title, description: task.description, status }));
  };

  const handleSubmit = (values: CreateTaskPayload) => {
    if (editingTask) {
      dispatch(updateTaskThunk({ ...values, id: editingTask.id })).then(() => setModalOpen(false));
    } else {
      dispatch(createTaskThunk(values)).then(() => setModalOpen(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm dark:shadow-none transition-colors duration-300">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => dispatch(setFilter(opt.value))}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                filter === opt.value
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                filter === opt.value
                  ? 'bg-black/20 text-black/80'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
              }`}>
                {counts[opt.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-red-500 dark:text-red-400 text-sm transition-colors duration-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && tasks.length === 0 && (
        <div className="py-20">
          <LoadingSpinner size="lg" text="Loading tasks..." />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTasks.length === 0 && (
        <EmptyState
          title={filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          description={filter === 'all'
            ? 'Create your first task to get started on your project.'
            : `You have no tasks with "${filter}" status.`}
          action={
            filter === 'all' ? (
              <button
                onClick={handleCreate}
                className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/20"
              >
                Create First Task
              </button>
            ) : undefined
          }
        />
      )}

      {/* Task Grid */}
      {filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        isLoading={isLoading}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TaskList;
