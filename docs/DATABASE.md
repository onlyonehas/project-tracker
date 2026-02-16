# :floppy_disk: Database

The app uses SQLite. The database file is at **`backend/data/tasks.db`** (or the path in `SQLITE_DB_PATH` if set). The file is created when the backend first runs.

---

## :computer: Edit from the CLI

Use the built-in `sqlite3` command (macOS/Linux):

```bash
cd backend
sqlite3 data/tasks.db
```

Then run SQL:

```sql
.tables
SELECT * FROM tasks;
.quit
```

One-off query:

```bash
sqlite3 data/tasks.db "SELECT * FROM tasks;"
```

---

## :pencil2: Edit in VS Code

1. Install the **SQLite Viewer** or **SQLite** extension.
2. Open `backend/data/tasks.db` in the editor.
3. Browse tables and run queries in the extension UI.

---

## Schema

| Column      | Type |
| ----------- | ---- |
| id          | TEXT |
| title       | TEXT |
| description | TEXT |
| status      | TEXT |
| due_date    | TEXT |
| created_by  | TEXT |
| created_at  | TEXT |
| updated_at  | TEXT |
