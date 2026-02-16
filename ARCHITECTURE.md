# Architecture

- **backend**: Express, SQLite (better-sqlite3), REST API. See backend/API.md.
- **frontend**: React + Vite, talks to backend on port 3000.

API: GET/POST /api/tasks, GET/PATCH/DELETE /api/tasks/:id.

Frontend: CRUD, search, filter, sort, dark mode, toasts, keyboard shortcuts.
