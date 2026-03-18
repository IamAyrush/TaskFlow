import type { Task, User } from '../types';

export const MOCK_USER: User = {
  id: '1',
  username: 'test',
  email: 'test@example.com',
};

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjE2MjM5MDIyfQ.faketoken';

export const MOCK_CREDENTIALS = { username: 'test', password: 'test123' };

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design System Setup',
    description: 'Configure Tailwind CSS and Ant Design component library for the project.',
    status: 'done',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '2',
    title: 'Implement Auth Flow',
    description: 'Build login page with JWT simulation and protected routes.',
    status: 'done',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Build Task CRUD API',
    description: 'Create mock service worker handlers for all task endpoints.',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '4',
    title: 'Write Unit Tests',
    description: 'Achieve 100% code coverage with Jest and React Testing Library.',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '5',
    title: 'Deploy to Vercel',
    description: 'Set up CI/CD pipeline and deploy the application to production.',
    status: 'todo',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];
