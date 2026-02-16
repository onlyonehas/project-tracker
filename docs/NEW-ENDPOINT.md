# :electric_plug: How to Add a New Endpoint

This guide walks through adding a new API endpoint to the backend.

---

## :one: Add the route in `server.ts`

Open `backend/src/server.ts` and add your route. Use the existing pattern:

```ts
// GET /api/example
app.get('/api/example', (_req: Request, res: Response) => {
  try {
    const data = { message: 'Hello' }
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to retrieve data' })
  }
})
```

---

## :two: Add validation (if needed)

Create validators in `backend/src/validation.ts`:

```ts
export function validateMyField(value: unknown): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, error: 'Field is required', statusCode: 400 }
  }
  // ... validation logic
  return { valid: true }
}
```

Use in `server.ts`:

```ts
const result = validateMyField(req.body.myField)
if (!result.valid)
  return res.status(result.statusCode).json({ error: result.error })
```

---

## :three: Add database access (if needed)

Add functions in `backend/src/db.ts`:

```ts
export function getMyData() {
  const rows = db.prepare('SELECT * FROM my_table').all()
  return rows
}
```

If the table does not exist, add it in `initDb()`:

```ts
db.exec(`
  CREATE TABLE IF NOT EXISTS my_table (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )
`)
```

---

## :four: Update the frontend

1. Add API calls in `frontend/src/services/api.ts`
2. Use the new data in your components (e.g. `App.tsx`)

---

## :five: Document the endpoint

Add the new endpoint to [API.md](API.md) with method, path, response, and error codes.
