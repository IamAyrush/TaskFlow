import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Task, TaskStatus, CreateTaskPayload } from '../../types';

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (values: CreateTaskPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters'),
  status: Yup.mixed<TaskStatus>()
    .oneOf(['todo', 'in-progress', 'done'])
    .required('Status is required'),
});

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskForm = ({ initialValues, onSubmit, onCancel, isLoading }: TaskFormProps) => {
  const formik = useFormik<CreateTaskPayload>({
    initialValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'todo',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const inputClass = (field: keyof typeof formik.values) =>
    `w-full bg-gray-100 dark:bg-zinc-800/80 border rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
      formik.touched[field] && formik.errors[field]
        ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/30'
        : 'border-gray-300 dark:border-zinc-700 focus:ring-yellow-500/30 focus:border-yellow-500/50'
    }`;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
      {/* Title */}
      <div>
        <label className="block text-gray-700 dark:text-zinc-300 text-sm font-medium mb-2 transition-colors duration-300" htmlFor="title">
          Title <span className="text-yellow-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="What needs to be done?"
          className={inputClass('title')}
          {...formik.getFieldProps('title')}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="mt-1.5 text-red-500 dark:text-red-400 text-xs">{formik.errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 dark:text-zinc-300 text-sm font-medium mb-2 transition-colors duration-300" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add more details..."
          className={`${inputClass('description')} resize-none`}
          {...formik.getFieldProps('description')}
        />
        <div className="flex items-center justify-between mt-1.5">
          {formik.touched.description && formik.errors.description ? (
            <p className="text-red-500 dark:text-red-400 text-xs">{formik.errors.description}</p>
          ) : <span />}
          <span className="text-gray-400 dark:text-zinc-600 text-xs">{formik.values.description.length}/500</span>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-gray-700 dark:text-zinc-300 text-sm font-medium mb-2 transition-colors duration-300">
          Status <span className="text-yellow-500">*</span>
        </label>
        <div className="flex gap-2">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => formik.setFieldValue('status', opt.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                formik.values.status === opt.value
                  ? opt.value === 'todo'
                    ? 'bg-gray-200 dark:bg-zinc-700 border-gray-400 dark:border-zinc-500 text-gray-900 dark:text-white'
                    : opt.value === 'in-progress'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600 dark:text-yellow-500'
                    : 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 font-semibold hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !formik.isValid || !formik.dirty}
          className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </span>
          ) : initialValues ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
