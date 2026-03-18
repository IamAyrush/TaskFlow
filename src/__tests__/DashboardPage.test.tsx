import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '../pages/DashboardPage';
import authReducer from '../store/authSlice';
import tasksReducer from '../store/tasksSlice';

jest.mock('../components/ui/ParticleBackground', () => ({
  __esModule: true,
  default: () => <canvas data-testid="particle-bg" />,
}));

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

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.setItem('task_manager_token', 'fake-token');
  });
  afterEach(() => localStorage.clear());

  test('renders dashboard with heading', () => {
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Design System Setup')).toBeInTheDocument();
    });
  });
});
