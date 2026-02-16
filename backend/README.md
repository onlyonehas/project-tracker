# Backend

Express API for tasks.

- `GET /api/tasks` – list tasks
- `POST /api/tasks` – create (body: title, description?, status?, dueDate?)
- `PATCH /api/tasks/:id` – update (body: title?, description?, status?, dueDate?)
- `DELETE /api/tasks/:id` – delete

Run: `npm start` (default port 3000)
