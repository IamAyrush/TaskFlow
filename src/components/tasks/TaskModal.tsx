import { useEffect } from 'react';
import type { Task, CreateTaskPayload } from '../../types';
import TaskForm from './TaskForm';

interface TaskModalProps {
  isOpen: boolean;
  task?: Task;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTaskPayload) => void;
}

const TaskModal = ({ isOpen, task, isLoading, onClose, onSubmit }: TaskModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden animate-[modalIn_0.2s_ease-out] transition-colors duration-300">
        <div className="h-1 w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {task ? 'Edit Task' : 'New Task'}
              </h2>
              <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5 transition-colors duration-300">
                {task ? 'Update your task details' : 'Add a new task to your board'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 transition-all"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <TaskForm
            initialValues={task}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
