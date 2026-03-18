import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '../components/layout/Header';
import authReducer from '../store/authSlice';
import tasksReducer from '../store/tasksSlice';
import type { Task } from '../types';

const mockTasks: Task[] = [
  { id: '1', title: 'T1', description: '', status: 'done', createdAt: '', updatedAt: '' },
  { id: '2', title: 'T2', description: '', status: 'todo', createdAt: '', updatedAt: '' },
];

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, tasks: tasksReducer },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'fake-token',
        isLoading: false,
        error: null,
      },
      tasks: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
        filter: 'all' as const,
      },
    },
  });

describe('Header', () => {
  test('renders logo', () => {
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Flow')).toBeInTheDocument();
  });

  test('shows task counts', () => {
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('logout button dispatches logout', () => {
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByText('Logout'));
  });
});
