import { ChartColumnIncreasing, FolderKanban, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
]

function AppLayout() {
  const { user, logout } = useAuth()

  const items = user?.role === 'admin' ? [...navItems, { to: '/users', label: 'Users', icon: Users }] : navItems

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-[260px,1fr]">
        <aside className="panel h-fit p-4 md:sticky md:top-6">
          <div className="rounded-2xl bg-gradient-to-br from-ink to-ink/80 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.12em] text-white/70">ProjectFlow</p>
            <h1 className="mt-1 font-display text-2xl font-bold">Control Center</h1>
            <p className="mt-3 text-sm text-white/80">Welcome, {user?.name || 'User'}</p>
            <p className="text-xs uppercase tracking-[0.1em] text-white/60">{user?.role || 'member'}</p>
          </div>

          <nav className="mt-4 space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-ink text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button type="button" onClick={logout} className="btn-secondary mt-6 w-full gap-2">
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <main className="space-y-4">
          <header className="panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Delivery Pulse</h2>
              <p className="text-sm text-slate-500">Track teams, projects, and progress in one view.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sea/15 px-3 py-1 text-xs font-semibold text-sea">
              <ChartColumnIncreasing size={14} />
              Live Workspace
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
