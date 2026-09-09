import { useNavigate } from 'react-router-dom'
import type { RankingViewItem } from '../../lib/rankingView'
import { initials } from '../../lib/format'
import { DeltaBadge } from './DeltaBadge'

export function RankingRow({ item, index }: { item: RankingViewItem; index: number }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/jogadora/${item.id}`)}
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
      className="animate-fade-up flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3.5 py-3 text-left transition-colors duration-200 hover:bg-white/[0.07] sm:gap-4 sm:px-4"
    >
      <span className="w-7 shrink-0 text-center font-display text-lg font-bold text-sand-300/40 sm:w-8">
        {item.position}
      </span>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-700 font-display text-sm font-semibold text-sand-200">
        {initials(item.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-sand-100">{item.name}</span>
        <span className="block truncate text-xs text-sand-300/45">{item.meta}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-display text-lg font-bold text-sand-100">{item.points}</span>
        <DeltaBadge delta={item.delta} />
      </span>
    </button>
  )
}
