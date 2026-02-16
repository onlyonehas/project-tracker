import { useState, useEffect, useRef, FormEvent } from 'react'
import type { Task, TaskFormData, TaskStatus } from '../types'

const TITLE_MAX = 200

interface TaskFormProps {
  task?: Task | null
  onSubmit: (data: TaskFormData) => Promise<boolean>
  onCancel?: (() => void) | null
}

function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('pending')
  const [dueDate, setDueDate] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setStatus(task.status || 'pending')
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '')
      setCreatedBy(task.createdBy || '')
      setTimeout(() => titleInputRef.current?.focus(), 0)
    } else {
      setTitle('')
      setDescription('')
      setStatus('pending')
      setDueDate('')
      setCreatedBy('')
    }
  }, [task])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const success = await onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      status,
      dueDate: dueDate || null,
      createdBy: createdBy.trim() || undefined
    })
    
    if (success && !isEditing) {
      setTitle('')
      setDescription('')
      setStatus('pending')
      setDueDate('')
      setCreatedBy('')
    }
  }

  const charCount = title.length
  const charCounterClass = charCount >= TITLE_MAX 
    ? 'at-limit' 
    : charCount >= TITLE_MAX - 20 
      ? 'near-limit' 
      : ''

  return (
    <section className="form-section">
      <h2>{isEditing ? 'Edit Task' : 'New Task'}</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskTitle">Title</label>
          <input
            ref={titleInputRef}
            type="text"
            id="taskTitle"
            name="title"
            maxLength={TITLE_MAX}
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <span className={`char-counter ${charCounterClass}`}>
            {charCount}/{TITLE_MAX} characters
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="taskCreatedBy">Created by</label>
          <input
            type="text"
            id="taskCreatedBy"
            name="createdBy"
            placeholder="Your name (optional)"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="taskDescription">Description</label>
          <textarea
            id="taskDescription"
            name="description"
            rows={3}
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="taskStatus">Status</label>
            <select
              id="taskStatus"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taskDueDate">Due Date</label>
            <input
              type="date"
              id="taskDueDate"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Task' : 'Add Task'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

export default TaskForm
