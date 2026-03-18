import { configureStore } from '@reduxjs/toolkit';
import authReducer, { clearError, loginThunk, logoutThunk } from '../store/authSlice';
import { server } from '../mocks/server';
import { rest } from 'msw';

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

describe('authSlice', () => {
  test('initial state', () => {
    const store = makeStore();
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('clearError resets error', () => {
    const store = makeStore();
    store.dispatch({ type: 'auth/login/rejected', payload: 'Some error' });
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });

  test('loginThunk success', async () => {
    const store = makeStore();
    await store.dispatch(loginThunk({ username: 'test', password: 'test123' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.username).toBe('test');
    expect(state.token).toBeTruthy();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('loginThunk failure with wrong credentials', async () => {
    const store = makeStore();
    await store.dispatch(loginThunk({ username: 'wrong', password: 'wrong' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeTruthy();
  });

  test('loginThunk failure with network error', async () => {
    server.use(
      rest.post('/api/login', (_req, res) => res.networkError('Network failure'))
    );
    const store = makeStore();
    await store.dispatch(loginThunk({ username: 'test', password: 'test123' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeTruthy();
  });

  test('logoutThunk clears state', async () => {
    const store = makeStore();
    await store.dispatch(loginThunk({ username: 'test', password: 'test123' }));
    await store.dispatch(logoutThunk());
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
