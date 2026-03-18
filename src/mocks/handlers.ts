import { rest } from 'msw';
import { MOCK_USER, MOCK_TOKEN, MOCK_CREDENTIALS, INITIAL_TASKS } from './data';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

let tasks: Task[] = [...INITIAL_TASKS];

const generateId = () => Math.random().toString(36).substr(2, 9);


export const handlers = [
  rest.post('/api/login', async (req, res, ctx) => {
    const raw = await req.text();
    const body = JSON.parse(raw) as { username: string; password: string };
    if (body.username === MOCK_CREDENTIALS.username && body.password === MOCK_CREDENTIALS.password) {
      return res(ctx.status(200), ctx.json({ token: MOCK_TOKEN, user: MOCK_USER }));
    }
    return res(ctx.status(401), ctx.json({ message: 'Invalid username or password' }));
  }),

  rest.get('/api/tasks', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }
    return res(ctx.status(200), ctx.json(tasks));
  }),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }
    const raw = await req.text();
    const body = JSON.parse(raw) as CreateTaskPayload;
    const newTask: Task = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return res(ctx.status(201), ctx.json(newTask));
  }),

  rest.put('/api/tasks/:id', async (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }
    const { id } = req.params as { id: string };
    const raw = await req.text();
    const body = JSON.parse(raw) as Omit<UpdateTaskPayload, 'id'>;
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) {
      return res(ctx.status(404), ctx.json({ message: 'Task not found' }));
    }
    tasks[idx] = { ...tasks[idx], ...body, updatedAt: new Date().toISOString() };
    return res(ctx.status(200), ctx.json(tasks[idx]));
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }
    const { id } = req.params as { id: string };
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) {
      return res(ctx.status(404), ctx.json({ message: 'Task not found' }));
    }
    tasks = tasks.filter(t => t.id !== id);
    return res(ctx.status(204));
  }),
];

export const resetTasks = () => { tasks = [...INITIAL_TASKS]; };
