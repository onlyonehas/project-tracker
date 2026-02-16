export type TaskStatus = 'pending' | 'in-progress' | 'completed'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string
  createdBy?: string
}

export interface TaskFormData {
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string | null
  createdBy?: string
}

export interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
}

export type SortBy = 'dueDate' | 'title' | 'status'
export type Filter = 'all' | TaskStatus
export type Theme = 'light' | 'dark'
