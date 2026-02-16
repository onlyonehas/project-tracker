import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'tasks.db')
const dir = path.dirname(dbPath)
if (dir && dir !== '.') {
  fs.mkdirSync(dir, { recursive: true })
}

export interface TaskRow {
  id: string
  title: string
  description: string
  status: string
  due_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

function initDb(): Database.Database {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
      due_date TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  return db
}

export const db = initDb()

export function rowToTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function getAllTasks() {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all() as TaskRow[]
  return rows.map(rowToTask)
}

export function getTaskById(id: string) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow | undefined
  return row ? rowToTask(row) : null
}

export function createTask(task: {
  id: string
  title: string
  description: string
  status: string
  dueDate: string | null
  createdBy?: string
  createdAt: string
  updatedAt: string
}) {
  const stmt = db.prepare(`
    INSERT INTO tasks (id, title, description, status, due_date, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(
    task.id,
    task.title,
    task.description,
    task.status,
    task.dueDate,
    task.createdBy ?? null,
    task.createdAt,
    task.updatedAt
  )
  return getTaskById(task.id)!
}

export function updateTask(
  id: string,
  updates: {
    title?: string
    description?: string
    status?: string
    dueDate?: string | null
    createdBy?: string
    updatedAt: string
  }
) {
  const existing = getTaskById(id)
  if (!existing) return null

  const merged = {
    ...existing,
    ...updates,
    updatedAt: updates.updatedAt
  }

  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, created_by = ?, updated_at = ?
    WHERE id = ?
  `).run(
    merged.title,
    merged.description,
    merged.status,
    merged.dueDate,
    merged.createdBy ?? null,
    merged.updatedAt,
    id
  )

  return getTaskById(id)!
}

export function deleteTask(id: string): boolean {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
  return result.changes > 0
}
