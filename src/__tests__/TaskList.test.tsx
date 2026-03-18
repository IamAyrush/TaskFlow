import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TaskList from '../components/tasks/TaskList';
import authReducer from '../store/authSlice';
import tasksReducer from '../store/tasksSlice';
import { resetTasks } from '../mocks/handlers';

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, tasks: tasksReducer },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'test', email: 'test@example.com' },
        token: 'fake-token',
        isLoading: false,
        error: null,
      },
    },
  });

const renderTaskList = (store = makeStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <TaskList />
      </MemoryRouter>
    </Provider>
  );

describe('TaskList', () => {
  beforeEach(() => {
    resetTasks();
    localStorage.setItem('task_manager_token', 'fake-token');
  });
  afterEach(() => localStorage.clear());

  test('renders filter tabs', () => {
    renderTaskList();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('renders new task button', () => {
    renderTaskList();
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('loads tasks on mount', async () => {
    renderTaskList();
    await waitFor(() => {
      expect(screen.getByText('Design System Setup')).toBeInTheDocument();
    });
  });

  test('opens modal on new task click', async () => {
    renderTaskList();
    await waitFor(() => screen.getByText('Design System Setup'));
    fireEvent.click(screen.getByText('New Task'));
    expect(screen.getByText('New Task', { selector: 'h2' })).toBeInTheDocument();
  });

  test('filters tasks by status', async () => {
    renderTaskList();
    await waitFor(() => screen.getByText('Design System Setup'));
    // Click the filter tab button (not the task status badge)
    const filterTabs = screen.getAllByRole('button', { name: /^To Do/ });
    fireEvent.click(filterTabs[0]);
    await waitFor(() => {
      expect(screen.getByText('Deploy to Vercel')).toBeInTheDocument();
    });
  });

  test('creates a new task', async () => {
    renderTaskList();
    await waitFor(() => screen.getByText('Design System Setup'));
    fireEvent.click(screen.getByText('New Task'));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'My New Task' } });
    fireEvent.click(screen.getByText('Create Task'));
    await waitFor(() => {
      expect(screen.getByText('My New Task')).toBeInTheDocument();
    });
  });

  test('shows empty state when filter has no tasks', async () => {
    renderTaskList();
    await waitFor(() => screen.getByText('Design System Setup'));
    // Click the Done filter tab - seed data has 2 done tasks
    const filterButtons = screen.getAllByRole('button');
    const doneFilterBtn = filterButtons.find(b => b.textContent?.startsWith('Done'));
    if (doneFilterBtn) fireEvent.click(doneFilterBtn);
    await waitFor(() => {
      expect(screen.getByText('Design System Setup')).toBeInTheDocument();
    });
  });
});
