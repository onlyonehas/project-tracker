# Project Tracker

Task list: React + Vite frontend, Express backend, SQLite. Monorepo (root package.json runs both).

```
backend/     Express API, SQLite in backend/data/
frontend/    React app
```

## Setup

```bash
npm run install:all
```

## Run

```bash
npm run dev
```

(Or `npm run dev:backend` / `npm run dev:frontend` in two terminals.)

## Build & test

- `npm run build` – frontend prod build
- `npm run lint` – ESLint + type-check (frontend and backend)
- `npm test` – backend then frontend tests. Backend: start server first, then `npm run test:backend`. Frontend: `npm run test:frontend`.

## Backend

SQLite in `backend/data/tasks.db` (override with `SQLITE_DB_PATH`). Endpoints and validation: [backend/API.md](backend/API.md).

## App

CRUD tasks, get by ID, optional "Created by", search/filter by status and text, sort by due date/title/status. Stats, toasts, dark mode (localStorage), title length 200, due date labels (today, overdue, etc.). Shortcuts: `n` new, `Esc` cancel, `/` search.
