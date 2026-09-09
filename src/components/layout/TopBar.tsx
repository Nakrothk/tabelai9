import { Search } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { CategoryTabs } from './CategoryTabs'

export function TopBar({ onOpenSearch }: { onOpenSearch: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sunset-500 to-gold-400 font-display text-base font-bold text-ink-950">
              S8
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold tracking-wide text-sand-100">RANKING BT</p>
              <p className="-mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-sand-300/50">Super 8 · Feminino</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {[
              { to: '/', label: 'Ranking', end: true },
              { to: '/historico', label: 'Histórico', end: false },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-sand-100' : 'text-sand-300/50 hover:text-sand-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={onOpenSearch}
            aria-label="Buscar jogadora"
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-sand-200 transition-colors hover:bg-white/10"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        </div>
        <CategoryTabs />
      </div>
    </header>
  )
}
