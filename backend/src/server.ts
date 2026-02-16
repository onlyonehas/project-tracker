import express, { Request, Response } from 'express'
import cors from 'cors'
import { validateTitle, validateStatus, validateDueDate, sanitiseString } from './validation'

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

;[
  { title: 'Review PR #42', description: 'Check backend changes', status: 'pending', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
  { title: 'Update docs', description: 'Add API section', status: 'in-progress', dueDate: new Date().toISOString().slice(0, 10) },
  { title: 'Deploy staging', description: 'Run deployment', status: 'completed', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10) }
].forEach((t) => {
  const id = String(nextId++)
  const now = new Date().toISOString()
  tasks.set(id, { id, ...t, createdAt: now, updatedAt: now } as Task)
})

app.get('/api/tasks', (_req: Request, res: Response) => {
  res.json(Array.from(tasks.values()))
})

app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.get(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
})

app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description, status = 'pending', dueDate } = req.body
  const t = validateTitle(title)
  if (!t.valid) return res.status(t.statusCode).json({ error: t.error })
  const s = validateStatus(status)
  if (!s.valid) return res.status(s.statusCode).json({ error: s.error })
  const d = validateDueDate(dueDate)
  if (!d.valid) return res.status(d.statusCode).json({ error: d.error })
  const id = String(nextId++)
  const now = new Date().toISOString()
  const task: Task = {
    id,
    title: (title as string).trim(),
    description: sanitiseString(description),
    status: ['pending', 'in-progress', 'completed'].includes(status) ? status : 'pending',
    dueDate: dueDate && typeof dueDate === 'string' && dueDate.trim() ? dueDate.trim() : null,
    createdAt: now,
    updatedAt: now
  }
  tasks.set(id, task)
  res.status(201).json(task)
})

app.patch('/api/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.get(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  const { title, description, status, dueDate } = req.body
  if (title !== undefined) {
    const t = validateTitle(title)
    if (!t.valid) return res.status(t.statusCode).json({ error: t.error })
    task.title = (title as string).trim()
  }
  if (description !== undefined) task.description = sanitiseString(description)
  if (status !== undefined) {
    const s = validateStatus(status)
    if (!s.valid) return res.status(s.statusCode).json({ error: s.error })
    task.status = status
  }
  if (dueDate !== undefined) task.dueDate = dueDate && typeof dueDate === 'string' && dueDate.trim() ? dueDate.trim() : null
  task.updatedAt = new Date().toISOString()
  res.json(task)
})

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  if (!tasks.has(req.params.id)) return res.status(404).json({ error: 'Task not found' })
  tasks.delete(req.params.id)
  res.status(204).send()
})

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))

export default app
