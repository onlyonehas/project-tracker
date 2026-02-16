import type { Task } from '../types'

interface TaskCardProps {
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDueDate = (dateStr?: string): string => {
    if (!dateStr) return 'No date'
    const d = new Date(dateStr + 'T12:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    d.setHours(0, 0, 0, 0)

    const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`
    if (diffDays > 7) return `Due in ${diffDays} days`
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days`
    return d.toLocaleDateString()
  }

  const statusClass = `badge-${(task.status || 'pending').replace(' ', '-')}`
  const due = formatDueDate(task.dueDate)

  return (
    <li className="task-card" data-id={task.id}>
      <h3>{task.title}</h3>
      <div className="task-meta">
        <span className={`badge ${statusClass}`}>{task.status || 'pending'}</span>
        <span>{due}</span>
        {task.createdBy && <span>By {task.createdBy}</span>}
      </div>
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}
      <div className="task-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onEdit(task.id)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskCard
