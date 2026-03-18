import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from '../components/layout/PrivateRoute';
import authReducer from '../store/authSlice';
import tasksReducer from '../store/tasksSlice';

const makeStore = (authenticated: boolean) =>
  configureStore({
    reducer: { auth: authReducer, tasks: tasksReducer },
    preloadedState: {
      auth: {
        isAuthenticated: authenticated,
        user: authenticated ? { id: '1', username: 'test', email: 'test@example.com' } : null,
        token: authenticated ? 'token' : null,
        isLoading: false,
        error: null,
      },
    },
  });

describe('PrivateRoute', () => {
  test('renders children when authenticated', () => {
    render(
      <Provider store={makeStore(true)}>
        <MemoryRouter>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    render(
      <Provider store={makeStore(false)}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
