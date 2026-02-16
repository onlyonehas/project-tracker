import type { Task, TaskFormData } from '../types'

export async function fetchTasks(apiBase: string): Promise<Task[]> {
  const res = await fetch(`${apiBase}/tasks`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function createTask(apiBase: string, data: TaskFormData): Promise<Task> {
  const res = await fetch(`${apiBase}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateTask(apiBase: string, id: string, data: Partial<TaskFormData>): Promise<Task> {
  const res = await fetch(`${apiBase}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function deleteTask(apiBase: string, id: string): Promise<void> {
  const res = await fetch(`${apiBase}/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
}
