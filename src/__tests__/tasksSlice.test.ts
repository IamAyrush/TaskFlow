import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { setFilter, clearTaskError, fetchTasksThunk, createTaskThunk, updateTaskThunk, deleteTaskThunk } from '../store/tasksSlice';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { resetTasks } from '../mocks/handlers';

const makeStore = () => configureStore({ reducer: { tasks: tasksReducer } });

beforeEach(() => {
  resetTasks();
  localStorage.setItem('task_manager_token', 'fake-token');
});

afterEach(() => {
  localStorage.clear();
});

describe('tasksSlice', () => {
  test('initial state', () => {
    const store = makeStore();
    const state = store.getState().tasks;
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.filter).toBe('all');
  });

  test('setFilter', () => {
    const store = makeStore();
    store.dispatch(setFilter('done'));
    expect(store.getState().tasks.filter).toBe('done');
  });

  test('clearTaskError', () => {
    const store = makeStore();
    store.dispatch({ type: 'tasks/fetchAll/rejected', payload: 'error' });
    store.dispatch(clearTaskError());
    expect(store.getState().tasks.error).toBeNull();
  });

  test('fetchTasksThunk success', async () => {
    const store = makeStore();
    await store.dispatch(fetchTasksThunk());
    const state = store.getState().tasks;
    expect(state.tasks.length).toBeGreaterThan(0);
    expect(state.isLoading).toBe(false);
  });

  test('fetchTasksThunk failure', async () => {
    server.use(
      rest.get('/api/tasks', (_req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Server error' })))
    );
    const store = makeStore();
    await store.dispatch(fetchTasksThunk());
    expect(store.getState().tasks.error).toBeTruthy();
  });

  test('createTaskThunk success', async () => {
    const store = makeStore();
    await store.dispatch(createTaskThunk({ title: 'New Task', description: 'Desc', status: 'todo' }));
    const state = store.getState().tasks;
    expect(state.tasks.some(t => t.title === 'New Task')).toBe(true);
  });

  test('createTaskThunk failure', async () => {
    server.use(
      rest.post('/api/tasks', (_req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Failed' })))
    );
    const store = makeStore();
    await store.dispatch(createTaskThunk({ title: 'New Task', description: '', status: 'todo' }));
    expect(store.getState().tasks.error).toBeTruthy();
  });

  test('updateTaskThunk success', async () => {
    const store = makeStore();
    await store.dispatch(fetchTasksThunk());
    const task = store.getState().tasks.tasks[0];
    await store.dispatch(updateTaskThunk({ id: task.id, title: 'Updated', description: 'Updated desc', status: 'done' }));
    const updated = store.getState().tasks.tasks.find(t => t.id === task.id);
    expect(updated?.title).toBe('Updated');
    expect(updated?.status).toBe('done');
  });

  test('updateTaskThunk failure', async () => {
    server.use(
      rest.put('/api/tasks/:id', (_req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Failed' })))
    );
    const store = makeStore();
    await store.dispatch(updateTaskThunk({ id: '1', title: 'X', description: '', status: 'done' }));
    expect(store.getState().tasks.error).toBeTruthy();
  });

  test('deleteTaskThunk success', async () => {
    const store = makeStore();
    await store.dispatch(fetchTasksThunk());
    const task = store.getState().tasks.tasks[0];
    await store.dispatch(deleteTaskThunk(task.id));
    expect(store.getState().tasks.tasks.find(t => t.id === task.id)).toBeUndefined();
  });

  test('deleteTaskThunk failure', async () => {
    server.use(
      rest.delete('/api/tasks/:id', (_req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Failed' })))
    );
    const store = makeStore();
    await store.dispatch(deleteTaskThunk('1'));
    expect(store.getState().tasks.error).toBeTruthy();
  });
});
