import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../pages/LoginPage';
import authReducer from '../store/authSlice';
import tasksReducer from '../store/tasksSlice';

jest.mock('../components/ui/ParticleBackground', () => ({
  __esModule: true,
  default: () => <canvas data-testid="particle-bg" />,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const makeStore = () =>
  configureStore({ reducer: { auth: authReducer, tasks: tasksReducer } });

const renderLoginPage = (store = makeStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );

describe('LoginPage', () => {
  beforeEach(() => mockNavigate.mockClear());

  test('renders login form', () => {
    renderLoginPage();
    expect(screen.getByText(/taskflow/i, { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors on empty submit', async () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('successful login navigates to dashboard', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'test123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error on wrong credentials', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });
});
