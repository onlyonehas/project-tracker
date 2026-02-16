import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import TaskForm from './components/TaskForm'
import Controls from './components/Controls'
import TaskList from './components/TaskList'
import Loading from './components/Loading'
import Toast from './components/Toast'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api'
import type { Task, TaskFormData, SortBy, Filter } from './types'

const API_BASE = 'http://localhost:3000/api'
const SORT_KEY = 'project-tracker-sort'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sortBy, setSortBy] = useLocalStorage<SortBy>(SORT_KEY, 'dueDate')
  const { theme, toggleTheme } = useTheme()
  const formRef = useRef<HTMLDivElement>(null)

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks()
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTasks(API_BASE)
      setTasks(data)
    } catch (error) {
      showToast('Could not load tasks')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleCreateTask = useCallback(async (taskData: TaskFormData): Promise<boolean> => {
    setLoading(true)
    try {
      const newTask = await createTask(API_BASE, taskData)
      setTasks(prev => [...prev, newTask])
      showToast('Task created')
      return true
    } catch (error) {
      showToast('Failed to create task')
      return false
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleUpdateTask = useCallback(async (id: string, taskData: Partial<TaskFormData>): Promise<boolean> => {
    setLoading(true)
    try {
      const updated = await updateTask(API_BASE, id, taskData)
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      showToast('Task updated')
      return true
    } catch (error) {
      showToast('Failed to update task')
      return false
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleDeleteTask = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await deleteTask(API_BASE, id)
      setTasks(prev => prev.filter(t => t.id !== id))
      showToast('Task deleted')
    } catch (error) {
      showToast('Failed to delete task')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleEdit = useCallback((id: string) => {
    setEditingId(id)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      const matchStatus = filter === 'all' || task.status === filter
      if (!matchStatus) return false
      
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      const title = (task.title || '').toLowerCase()
      const desc = (task.description || '').toLowerCase()
      return title.includes(query) || desc.includes(query)
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'dueDate') {
        const da = a.dueDate || ''
        const db = b.dueDate || ''
        return da.localeCompare(db)
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '')
      }
      if (sortBy === 'status') {
        return (a.status || '').localeCompare(b.status || '')
      }
      return 0
    })
  }, [tasks, filter, searchQuery, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    }
  }, [tasks])

  const editingTask = editingId ? tasks.find(t => t.id === editingId) : null

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      
      if (e.key === 'Escape') {
        if (editingId) {
          handleCancelEdit()
        }
        if (inField) {
          (e.target as HTMLElement).blur()
        }
        e.preventDefault()
        return
      }
      
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey && !inField) {
        e.preventDefault()
        handleCancelEdit()
        // Focus will be handled by TaskForm useEffect
        setTimeout(() => {
          const titleInput = formRef.current?.querySelector('#taskTitle') as HTMLInputElement
          titleInput?.focus()
        }, 0)
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editingId, handleCancelEdit])

  return (
    <div data-theme={theme}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="main">
        <StatsCard stats={stats} />
        <div ref={formRef}>
          <TaskForm
            task={editingTask}
            onSubmit={editingId
              ? (data) =>
                  handleUpdateTask(editingId, data).then((success) => {
                    if (success) handleCancelEdit()
                    return success
                  })
              : handleCreateTask
            }
            onCancel={editingId ? handleCancelEdit : null}
          />
        </div>
        <Controls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          taskCount={filteredAndSortedTasks.length}
        />
        {loading && <Loading />}
        <TaskList
          tasks={filteredAndSortedTasks}
          onEdit={handleEdit}
          onDelete={handleDeleteTask}
        />
      </main>
      {toast && <Toast message={toast} />}
      <footer className="shortcuts-hint">
        <span><kbd>n</kbd> New task</span>
        <span><kbd>Esc</kbd> Clear form</span>
        <span><kbd>/</kbd> Focus search</span>
      </footer>
    </div>
  )
}

export default App
