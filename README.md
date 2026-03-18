# TaskFlow — Task Management Application

A beautiful, frontend-only task management application built with React and TypeScript. All backend operations are simulated using Mock Service Worker (MSW) — no real server needed.

**Live Demo:** [your-app.vercel.app](https://your-app.vercel.app)

---

## Features

- **Authentication** — Mocked login with fake JWT, persisted via `localStorage`
- **Task CRUD** — Create, read, update, and delete tasks with title, description, and status
- **Status Cycling** — Click a task's status badge to advance it: To Do → In Progress → Done
- **Filtering** — Filter tasks by status with live counts per category
- **Persistence** — Tasks saved to `localStorage`, survive page refresh
- **Dark / Light Mode** — Toggle with sun/moon button, preference saved across sessions
- **Animated Background** — Canvas particle animation with connecting lines
- **Responsive** — Mobile-friendly layout
- **Form Validation** — Formik + Yup with real-time error messages

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <your-repo-url>
cd task-manager
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Test credentials:**
| Field | Value |
|-------|-------|
| Username | `test` |
| Password | `test123` |

### Running Tests

```bash
npm test              # Run all tests with coverage report
npm run test:watch    # Watch mode
```

### Building for Production

```bash
npm run build    # Outputs to dist/
npm run preview  # Preview the production build locally
```

---

## How the Mocking Works

This app uses **Mock Service Worker (MSW) v1** to intercept HTTP requests at the browser's service worker level and return fake responses — no backend server required.

### Flow

```
React Component
    → Axios request (e.g. POST /api/tasks)
        → MSW service worker intercepts
            → Handler runs in-browser logic
                → Returns fake JSON response
                    → Axios resolves normally
```

### Setup

| File | Role |
|------|------|
| `public/mockServiceWorker.js` | Service worker script registered in the browser |
| `src/mocks/handlers.ts` | Request handlers — the "fake backend" logic |
| `src/mocks/browser.ts` | Starts the worker in browser (dev + production) |
| `src/mocks/server.ts` | Starts MSW in Node.js for Jest tests |
| `src/mocks/data.ts` | Seed tasks and mock user credentials |

### Mock Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/login` | — | Validates credentials, returns fake JWT + user object |
| `GET` | `/api/tasks` | ✅ | Returns all tasks |
| `POST` | `/api/tasks` | ✅ | Creates a new task |
| `PUT` | `/api/tasks/:id` | ✅ | Updates a task by ID |
| `DELETE` | `/api/tasks/:id` | ✅ | Deletes a task by ID |

All protected routes require `Authorization: Bearer <token>` header.

### Persistence

| Data | localStorage Key |
|------|-----------------|
| Auth token | `task_manager_token` |
| User info | `task_manager_user` |
| Tasks | `taskflow_tasks` |
| Theme preference | `taskflow_theme` |

Tasks are loaded from `localStorage` on startup. First visit pre-loads 5 seed tasks. All create/edit/delete operations are written back to `localStorage` immediately.

---

## Project Structure

```
task-manager/
├── public/
│   └── mockServiceWorker.js     # MSW service worker (auto-generated)
├── src/
│   ├── __mocks__/               # Jest static file stubs
│   ├── __tests__/               # All unit & integration tests
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Top nav with stats, theme toggle, logout
│   │   │   └── PrivateRoute.tsx # Auth guard for protected pages
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx     # Individual task card with actions
│   │   │   ├── TaskForm.tsx     # Create/edit form (Formik + Yup)
│   │   │   ├── TaskList.tsx     # Task grid with filters
│   │   │   └── TaskModal.tsx    # Modal wrapper for TaskForm
│   │   └── ui/
│   │       ├── EmptyState.tsx   # Empty state placeholder
│   │       ├── LoadingSpinner.tsx
│   │       └── ParticleBackground.tsx  # Canvas animation
│   ├── context/
│   │   └── ThemeContext.tsx     # Dark/light mode context + hook
│   ├── hooks/
│   │   └── useAppDispatch.ts    # Typed Redux hooks
│   ├── mocks/
│   │   ├── browser.ts           # MSW browser worker setup
│   │   ├── data.ts              # Seed data & credentials
│   │   ├── handlers.ts          # Mock API handlers with localStorage
│   │   └── server.ts            # MSW Node server for Jest
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── LoginPage.tsx
│   ├── services/
│   │   ├── api.ts               # Axios instance with auth interceptor
│   │   ├── authService.ts
│   │   └── tasksService.ts
│   ├── store/
│   │   ├── authSlice.ts         # Auth state (Redux Toolkit)
│   │   ├── tasksSlice.ts        # Tasks state (Redux Toolkit)
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── setupTests.ts
├── .gitignore
├── .vscode/settings.json        # Use workspace TypeScript version
├── jest.config.cjs
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                  # SPA routing fix for Vercel
└── vite.config.ts
```

---

## Libraries Used

| Category | Library | Version | Purpose |
|----------|---------|---------|---------|
| Framework | React | 18 | UI library |
| Build tool | Vite | 5 | Dev server & bundler |
| Language | TypeScript | 5 | Type safety |
| State | Redux Toolkit | 2 | Global auth & task state |
| Routing | React Router | 6 | Client-side navigation |
| Styling | Tailwind CSS | 3 | Utility-first CSS |
| Mock API | MSW | 1 | Service worker request mocking |
| HTTP | Axios | 1 | HTTP client |
| Forms | Formik + Yup | — | Form state & validation |
| Testing | Jest + React Testing Library | — | Unit & integration tests |

---

## Deployment (Vercel)

The project includes `vercel.json` which configures SPA routing — all paths fall back to `index.html` so React Router handles navigation client-side.

### Deploy via Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Deploy via GitHub (recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — no extra config needed
5. Click **Deploy**

> **Note:** Vercel auto-reads `vercel.json` and `vite.config.ts`. Build command and output directory are configured automatically.

---

## Test Coverage

```
npm test
```

| Metric | Coverage |
|--------|---------|
| Statements | ~80% |
| Branches | ~80% |
| Functions | ~89% |
| Lines | ~80% |

12 test suites · 71 tests · all passing
