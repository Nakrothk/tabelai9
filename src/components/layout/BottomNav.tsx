import { NavLink } from 'react-router-dom'
import { Trophy, CalendarDays } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Ranking', icon: Trophy, end: true },
  { to: '/historico', label: 'Histórico', icon: CalendarDays, end: false },
]

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-white/5 bg-ink-900/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] sm:hidden">
      <div className="mx-auto flex max-w-2xl">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                isActive ? 'text-sunset-400' : 'text-sand-300/50'
              }`
            }
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
