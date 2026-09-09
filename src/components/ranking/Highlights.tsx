import { useNavigate } from 'react-router-dom'
import { Crown, TrendingUp } from 'lucide-react'
import type { CategoryData } from '../../types'

export function Highlights({ categoryData }: { categoryData: CategoryData }) {
  const navigate = useNavigate()
  const leader = categoryData.players.find((p) => p.id === categoryData.leaderId)
  const rising = categoryData.players.find((p) => p.id === categoryData.risingPlayerId)

  if (!leader && !rising) return null

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {leader && (
        <button
          onClick={() => navigate(`/jogadora/${leader.id}`)}
          className="flex items-center gap-3 rounded-2xl border border-gold-400/20 bg-gold-400/[0.06] px-4 py-3 text-left transition-colors hover:bg-gold-400/[0.1]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-400">
            <Crown className="h-4.5 w-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-sand-300/50">
              Líder da categoria
            </span>
            <span className="block truncate font-display text-sm font-bold text-sand-100">{leader.name}</span>
          </span>
        </button>
      )}
      {rising && (
        <button
          onClick={() => navigate(`/jogadora/${rising.id}`)}
          className="flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-lime-400/[0.06] px-4 py-3 text-left transition-colors hover:bg-lime-400/[0.1]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-lime-400">
            <TrendingUp className="h-4.5 w-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-sand-300/50">
              Em ascensão na última etapa
            </span>
            <span className="block truncate font-display text-sm font-bold text-sand-100">{rising.name}</span>
          </span>
        </button>
      )}
    </div>
  )
}
