import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

interface Task {
  id: string
  title: string
  description: string
  status: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

const tasks = new Map<string, Task>()
let nextId = 1

// Seed demo data
;[
  { title: 'Review PR #42', description: 'Check backend changes', status: 'pending', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
  { title: 'Update docs', description: 'Add API section', status: 'in-progress', dueDate: new Date().toISOString().slice(0, 10) },
  { title: 'Deploy staging', description: 'Run deployment', status: 'completed', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10) }
].forEach((t) => {
  const id = String(nextId++)
  const now = new Date().toISOString()
  tasks.set(id, { id, ...t, createdAt: now, updatedAt: now } as Task)
})

// GET /api/tasks - retrieve all tasks
app.get('/api/tasks', (_req: Request, res: Response) => {
  res.json(Array.from(tasks.values()))
})

// POST /api/tasks - create a task
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description, status = 'pending', dueDate } = req.body
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' })
  }
  const id = String(nextId++)
  const now = new Date().toISOString()
  const task: Task = {
    id,
    title: title.trim(),
    description: (description && typeof description === 'string') ? description.trim() : '',
    status: ['pending', 'in-progress', 'completed'].includes(status) ? status : 'pending',
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now
  }
  tasks.set(id, task)
  res.status(201).json(task)
})

// PATCH /api/tasks/:id - update a task
app.patch('/api/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.get(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  const { title, description, status, dueDate } = req.body
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') return res.status(400).json({ error: 'Title cannot be empty' })
    task.title = title.trim()
  }
  if (description !== undefined) task.description = typeof description === 'string' ? description.trim() : ''
  if (status !== undefined && ['pending', 'in-progress', 'completed'].includes(status)) task.status = status
  if (dueDate !== undefined) task.dueDate = dueDate || null
  task.updatedAt = new Date().toISOString()
  res.json(task)
})

// DELETE /api/tasks/:id - delete a task
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  if (!tasks.has(req.params.id)) return res.status(404).json({ error: 'Task not found' })
  tasks.delete(req.params.id)
  res.status(204).send()
})

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))

export default app
