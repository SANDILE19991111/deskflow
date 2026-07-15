import { useAuth } from '../../auth/AuthContext.jsx'

function AppShell({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold tracking-tight text-ink">DeskFlow</span>
            <span className="rounded-full bg-indigo-dim px-2 py-0.5 font-mono text-[11px] font-medium text-indigo">
              {user?.role}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/70">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm font-medium text-ink/50 transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}

export default AppShell
