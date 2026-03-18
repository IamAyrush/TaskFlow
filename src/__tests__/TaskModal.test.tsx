import { render, screen, fireEvent } from '@testing-library/react';
import TaskModal from '../components/tasks/TaskModal';

const onClose = jest.fn();
const onSubmit = jest.fn();

describe('TaskModal', () => {
  beforeEach(() => {
    onClose.mockClear();
    onSubmit.mockClear();
  });

  test('renders nothing when closed', () => {
    render(<TaskModal isOpen={false} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  test('renders when open', () => {
    render(<TaskModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('renders edit mode when task provided', () => {
    const task = { id: '1', title: 'T', description: 'D', status: 'todo' as const, createdAt: '', updatedAt: '' };
    render(<TaskModal isOpen={true} task={task} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  test('calls onClose when backdrop clicked', () => {
    render(<TaskModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const backdrop = document.querySelector('[aria-hidden="true"]')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onClose when close button clicked', () => {
    render(<TaskModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onClose when Escape pressed', () => {
    render(<TaskModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
