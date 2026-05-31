import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/downtime',    label: 'Downtime Dashboard', icon: '📊' },
  { to: '/downtime/log', label: 'Log Incident',      icon: '➕' },
  { to: '/sales',       label: 'Sales Report',        icon: '💰' },
  { to: '/import',      label: 'Import Data',         icon: '📂' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-[#003580] text-white flex flex-col shadow-lg">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <div>
            <p className="font-bold text-sm leading-tight">Shell Cafe</p>
            <p className="text-xs text-blue-200 leading-tight">Operations Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/downtime'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-blue-300">FormatMgr Y26</p>
        <p className="text-xs text-blue-400">v1.0.0</p>
      </div>
    </aside>
  )
}
