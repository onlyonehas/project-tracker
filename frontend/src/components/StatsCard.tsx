import type { TaskStats } from '../types'

interface StatsCardProps {
  stats: TaskStats
}

function StatsCard({ stats }: StatsCardProps) {
  return (
    <section className="stats-card" aria-label="Task statistics">
      <div className="stats-row">
        <div className="stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
    </section>
  )
}

export default StatsCard
