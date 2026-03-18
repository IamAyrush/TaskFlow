import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/tasks/TaskCard';
import type { Task } from '../types';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskCard', () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onStatusChange = jest.fn();

  beforeEach(() => {
    onEdit.mockClear();
    onDelete.mockClear();
    onStatusChange.mockClear();
  });

  test('renders task title and description', () => {
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('calls onEdit when edit button clicked', () => {
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByLabelText('Edit task'));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('shows confirm buttons when delete clicked', () => {
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByLabelText('Delete task'));
    expect(screen.getByLabelText('Confirm delete')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel delete')).toBeInTheDocument();
  });

  test('calls onDelete on confirm', () => {
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByLabelText('Delete task'));
    fireEvent.click(screen.getByLabelText('Confirm delete'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('cancels delete on No click', () => {
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByLabelText('Delete task'));
    fireEvent.click(screen.getByLabelText('Cancel delete'));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Delete task')).toBeInTheDocument();
  });

  test('calls onStatusChange when status badge clicked', () => {
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByTitle('Click to advance status'));
    expect(onStatusChange).toHaveBeenCalledWith('1', 'in-progress');
  });

  test('renders in-progress task with pulse dot', () => {
    const task = { ...mockTask, status: 'in-progress' as const };
    render(<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('renders done task', () => {
    const task = { ...mockTask, status: 'done' as const };
    render(<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('renders task without description', () => {
    const task = { ...mockTask, description: '' };
    render(<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />);
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });
});
