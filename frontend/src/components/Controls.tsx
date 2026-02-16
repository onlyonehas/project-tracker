import { useRef, useEffect } from 'react'
import type { Filter, SortBy } from '../types'

interface ControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filter: Filter
  onFilterChange: (value: Filter) => void
  sortBy: SortBy
  onSortChange: (value: SortBy) => void
  taskCount: number
}

function Controls({ 
  searchQuery, 
  onSearchChange, 
  filter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  taskCount 
}: ControlsProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      if (e.key === '/' && !inField && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filters: Array<{ value: Filter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ]

  return (
    <section className="controls">
      <div className="search-wrap">
        <label htmlFor="searchInput" className="visually-hidden">Search tasks</label>
        <input
          ref={searchInputRef}
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-buttons" role="group" aria-label="Filter by status">
        {filters.map(f => (
          <button
            key={f.value}
            type="button"
            className={`filter-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="sort-wrap">
        <label htmlFor="sortSelect">Sort by:</label>
        <select
          id="sortSelect"
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
        >
          <option value="dueDate">Due Date</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>
      </div>
      <p className="filter-count">
        Showing {taskCount} task{taskCount !== 1 ? 's' : ''}
      </p>
    </section>
  )
}

export default Controls
