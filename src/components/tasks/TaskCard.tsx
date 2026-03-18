import { useState } from 'react';
import type { Task, TaskStatus } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string; dot: string }> = {
  todo: { label: 'To Do', color: 'text-gray-500 dark:text-zinc-400', bg: 'bg-gray-100 dark:bg-zinc-800/50 border-gray-300 dark:border-zinc-700', dot: 'bg-gray-400 dark:bg-zinc-400' },
  'in-progress': { label: 'In Progress', color: 'text-yellow-600 dark:text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/30', dot: 'bg-yellow-500' },
  done: { label: 'Done', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30', dot: 'bg-green-500 dark:bg-green-400' },
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const cfg = statusConfig[task.status];

  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: 'in-progress',
    'in-progress': 'done',
    done: 'todo',
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 dark:hover:shadow-yellow-500/5 hover:-translate-y-0.5">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 dark:text-white font-semibold text-base leading-snug truncate group-hover:text-yellow-600 dark:group-hover:text-yellow-50 transition-colors">
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all duration-200"
            aria-label="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-400 hover:text-red-500 hover:border-red-400/50 transition-all duration-200"
              aria-label="Delete task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 rounded-md bg-red-500/20 border border-red-500/50 text-red-500 dark:text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all"
                aria-label="Confirm delete"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 text-xs font-medium hover:text-gray-900 dark:hover:text-white transition-all"
                aria-label="Cancel delete"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2 transition-colors duration-300">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 ${cfg.bg} ${cfg.color}`}
          title="Click to advance status"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${task.status === 'in-progress' ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </button>
        <span className="text-gray-400 dark:text-zinc-600 text-xs transition-colors duration-300">
          {formatDate(task.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
