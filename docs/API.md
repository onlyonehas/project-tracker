# :book: Task API

Base URL: `http://localhost:3000/api`

**Interactive docs:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (Swagger UI)

All request/response bodies use JSON. All dates/times use ISO 8601 strings (e.g. `2026-02-20` or `2026-02-20T14:30:00Z`).

---

## Retrieve all tasks

**GET** `/tasks`

**Response:** `200 OK`

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "pending" | "in-progress" | "completed",
    "dueDate": "string | null",
    "createdBy": "string | undefined",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

---

## Retrieve a task by ID

**GET** `/tasks/:id`

**Parameters:** `id` – task ID (short string, e.g. `xK3_j2Lp`)

**Response:** `200 OK` – task object  
**Error:** `404 Not Found` – `{ "error": "Task not found" }`

---

## Create a task

**POST** `/tasks`

**Body:**

| Field       | Type   | Required | Description                                                    |
| ----------- | ------ | -------- | -------------------------------------------------------------- |
| title       | string | Yes      | Task title (max 500 chars)                                     |
| description | string | No       | Optional description                                           |
| status      | string | No       | `pending` \| `in-progress` \| `completed` (default: `pending`) |
| dueDate     | string | No       | Due date/time (ISO 8601)                                       |
| createdBy   | string | No       | Name of person creating the task                               |

**Response:** `201 Created` – created task object  
**Errors:**

- `400 Bad Request` – `{ "error": "Title is required" }` (or other validation message)

---

## Update a task

**PATCH** `/tasks/:id`

**Parameters:** `id` – task ID (short string, e.g. `xK3_j2Lp`)

**Body:** Any subset of: `title`, `description`, `status`, `dueDate`, `createdBy`. Only provided fields are updated.

**Response:** `200 OK` – updated task object  
**Errors:**

- `404 Not Found` – `{ "error": "Task not found" }`
- `400 Bad Request` – validation error (e.g. empty title, invalid status)

---

## Update the status of a task

Use **PATCH** `/tasks/:id` with body `{ "status": "pending" | "in-progress" | "completed" }`.

**Response:** `200 OK` – updated task object  
**Errors:** `404` or `400` as above.

---

## Delete a task

**DELETE** `/tasks/:id`

**Parameters:** `id` – task ID (short string, e.g. `xK3_j2Lp`)

**Response:** `204 No Content` (empty body)  
**Error:** `404 Not Found` – `{ "error": "Task not found" }`
