import { http, HttpResponse } from 'msw'
import type { Task, TaskFormData } from '../../types'

const API_BASE = 'http://localhost:3000/api'

let tasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'First test task',
    status: 'pending',
    dueDate: '2026-02-20'
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Second test task',
    status: 'in-progress',
    dueDate: '2026-02-18'
  }
]

export const handlers = [
  http.get(`${API_BASE}/tasks`, () => {
    return HttpResponse.json(tasks)
  }),

  http.post(`${API_BASE}/tasks`, async ({ request }) => {
    const body = await request.json() as TaskFormData
    const newTask: Task = {
      id: String(Date.now()),
      title: body.title || '',
      description: body.description,
      status: body.status || 'pending',
      dueDate: body.dueDate || undefined,
      createdBy: body.createdBy
    }
    tasks.push(newTask)
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.patch(`${API_BASE}/tasks/:id`, async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = await request.json() as Partial<TaskFormData>
    const taskIndex = tasks.findIndex(t => t.id === id)
    
    if (taskIndex === -1) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...body } as Task
    return HttpResponse.json(tasks[taskIndex])
  }),

  http.delete(`${API_BASE}/tasks/:id`, ({ params }) => {
    const { id } = params as { id: string }
    const taskIndex = tasks.findIndex(t => t.id === id)
    
    if (taskIndex === -1) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    tasks.splice(taskIndex, 1)
    return HttpResponse.json({ success: true })
  })
]
