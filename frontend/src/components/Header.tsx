import type { Theme } from '../types'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <h1>Project Tracker</h1>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        title="Toggle dark mode"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </header>
  )
}

export default Header
