import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/tasks/TaskForm';

const onSubmit = jest.fn();
const onCancel = jest.fn();

describe('TaskForm', () => {
  beforeEach(() => {
    onSubmit.mockClear();
    onCancel.mockClear();
  });

  test('renders all form fields', () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('shows validation error for short title', async () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'ab' } });
    fireEvent.blur(screen.getByLabelText(/title/i));
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.blur(screen.getByLabelText(/title/i));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for long description', async () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'a'.repeat(501) } });
    fireEvent.blur(screen.getByLabelText(/description/i));
    await waitFor(() => {
      expect(screen.getByText(/cannot exceed 500/i)).toBeInTheDocument();
    });
  });

  test('calls onCancel when cancel clicked', () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  test('changes status on button click', async () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('In Progress'));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My Task' } });
    await waitFor(() => {
      const submitBtn = screen.getByText('Create Task');
      expect(submitBtn).not.toBeDisabled();
    });
  });

  test('renders with initial values for edit', () => {
    const task = { id: '1', title: 'Existing', description: 'Desc', status: 'done' as const, createdAt: '', updatedAt: '' };
    render(<TaskForm initialValues={task} onSubmit={onSubmit} onCancel={onCancel} />);
    expect(screen.getByDisplayValue('Existing')).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} isLoading={true} />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });
});
