import express, { Request, Response } from 'express'
import cors from 'cors'
import * as db from './db.js'
import {
  validateTitle,
  validateStatus,
  validateDueDate,
  sanitiseString
} from './validation.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Seed demo data only if database is empty
function seedIfEmpty() {
  const all = db.getAllTasks()
  if (all.length > 0) return
  const now = new Date()
  const demo = [
    {
      title: 'Review PR #42',
      description: 'Check backend changes',
      status: 'pending',
      dueDate: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
      createdBy: 'Demo User'
    },
    {
      title: 'Update docs',
      description: 'Add API section',
      status: 'in-progress',
      dueDate: new Date().toISOString().slice(0, 10),
      createdBy: 'Demo User'
    },
    {
      title: 'Deploy staging',
      description: 'Run deployment',
      status: 'completed',
      dueDate: new Date(now.getTime() - 86400000).toISOString().slice(0, 10),
      createdBy: 'Demo User'
    }
  ]
  demo.forEach((t) => {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    db.createTask({
      id,
      title: t.title,
      description: t.description,
      status: t.status,
      dueDate: t.dueDate,
      createdBy: t.createdBy,
      createdAt,
      updatedAt: createdAt
    })
  })
}

seedIfEmpty()

// GET /api/tasks - Retrieve all tasks
app.get('/api/tasks', (_req: Request, res: Response) => {
  try {
    const tasks = db.getAllTasks()
    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to retrieve tasks' })
  }
})

// GET /api/tasks/:id - Retrieve a task by ID
app.get('/api/tasks/:id', (req: Request, res: Response) => {
  try {
    const task = db.getTaskById(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to retrieve task' })
  }
})

// POST /api/tasks - Create a task
app.post('/api/tasks', (req: Request, res: Response) => {
  try {
    const { title, description, status = 'pending', dueDate, createdBy } = req.body

    const t = validateTitle(title)
    if (!t.valid) return res.status(t.statusCode).json({ error: t.error })

    const s = validateStatus(status)
    if (!s.valid) return res.status(s.statusCode).json({ error: s.error })

    const d = validateDueDate(dueDate)
    if (!d.valid) return res.status(d.statusCode).json({ error: d.error })

    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const task = db.createTask({
      id,
      title: (title as string).trim(),
      description: sanitiseString(description),
      status: ['pending', 'in-progress', 'completed'].includes(status) ? status : 'pending',
      dueDate: dueDate && typeof dueDate === 'string' && dueDate.trim() ? dueDate.trim() : null,
      createdBy: sanitiseString(createdBy) || undefined,
      createdAt: now,
      updatedAt: now
    })
    res.status(201).json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PATCH /api/tasks/:id - Update a task (including status)
app.patch('/api/tasks/:id', (req: Request, res: Response) => {
  try {
    const existing = db.getTaskById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const { title, description, status, dueDate, createdBy } = req.body

    if (title !== undefined) {
      const t = validateTitle(title)
      if (!t.valid) return res.status(t.statusCode).json({ error: t.error })
    }
    if (status !== undefined) {
      const s = validateStatus(status)
      if (!s.valid) return res.status(s.statusCode).json({ error: s.error })
    }
    if (dueDate !== undefined) {
      const d = validateDueDate(dueDate)
      if (!d.valid) return res.status(d.statusCode).json({ error: d.error })
    }

    const updated = db.updateTask(req.params.id, {
      ...(title !== undefined && { title: (title as string).trim() }),
      ...(description !== undefined && { description: sanitiseString(description) }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && {
        dueDate: dueDate && typeof dueDate === 'string' && dueDate.trim() ? dueDate.trim() : null
      }),
      ...(createdBy !== undefined && { createdBy: sanitiseString(createdBy) || undefined }),
      updatedAt: new Date().toISOString()
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteTask(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))

export default app
