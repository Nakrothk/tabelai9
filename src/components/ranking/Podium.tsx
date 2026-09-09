import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'
import type { RankingViewItem } from '../../lib/rankingView'
import { initials } from '../../lib/format'
import { DeltaBadge } from './DeltaBadge'

const TIER_STYLE = {
  1: {
    ring: 'from-gold-400 to-sunset-500',
    glow: 'shadow-[0_0_40px_-8px_rgba(255,209,102,0.55)]',
    label: 'LÍDER',
    order: 'sm:order-2',
    minHeight: 'sm:min-h-[236px]',
    avatar: 'h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl',
    badge: 'h-9 w-9 text-sm',
  },
  2: {
    ring: 'from-silver-400 to-white/40',
    glow: 'shadow-[0_0_28px_-10px_rgba(203,213,225,0.4)]',
    label: '2º LUGAR',
    order: 'sm:order-1',
    minHeight: 'sm:min-h-[192px]',
    avatar: 'h-16 w-16 text-lg sm:h-20 sm:w-20 sm:text-xl',
    badge: 'h-8 w-8 text-xs',
  },
  3: {
    ring: 'from-bronze-400 to-sunset-600/60',
    glow: 'shadow-[0_0_28px_-10px_rgba(224,164,92,0.4)]',
    label: '3º LUGAR',
    order: 'sm:order-3',
    minHeight: 'sm:min-h-[192px]',
    avatar: 'h-16 w-16 text-lg sm:h-20 sm:w-20 sm:text-xl',
    badge: 'h-8 w-8 text-xs',
  },
} as const

export function Podium({ items }: { items: RankingViewItem[] }) {
  const top3 = items.slice(0, 3)
  if (top3.length === 0) return null

  return (
    <div className="flex flex-col gap-3 pt-1 sm:grid sm:grid-cols-3 sm:items-end sm:gap-4">
      {top3.map((item, i) => (
        <PodiumCard key={item.id} item={item} tier={(i + 1) as 1 | 2 | 3} />
      ))}
    </div>
  )
}

function PositionBadge({ tier }: { tier: 1 | 2 | 3 }) {
  const style = TIER_STYLE[tier]
  return (
    <span
      className={`absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-gradient-to-br ring-[3px] ring-ink-900 shadow-[0_2px_8px_rgba(0,0,0,0.45)] ${style.ring} ${style.badge}`}
    >
      <span className="font-display font-extrabold text-ink-950">{tier}</span>
    </span>
  )
}

function PodiumCard({ item, tier }: { item: RankingViewItem; tier: 1 | 2 | 3 }) {
  const style = TIER_STYLE[tier]
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/jogadora/${item.id}`)}
      style={{ animationDelay: `${(tier - 1) * 90}ms` }}
      className={`animate-fade-up group relative flex w-full flex-col items-center justify-end gap-3 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent px-5 pb-6 pt-8 text-center transition-transform duration-300 hover:-translate-y-1 ${style.order} ${style.minHeight}`}
    >
      <div className="flex flex-col items-center gap-3">
        {tier === 1 && (
          <Crown className="h-6 w-6 fill-gold-400 text-gold-400 drop-shadow-[0_2px_6px_rgba(255,209,102,0.5)]" />
        )}

        <div className={`relative rounded-full bg-gradient-to-br p-[3px] ${style.ring} ${style.glow}`}>
          <span
            className={`flex items-center justify-center rounded-full bg-ink-800 font-display font-bold text-sand-100 ${style.avatar}`}
          >
            {initials(item.name)}
          </span>
          <PositionBadge tier={tier} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-[11px] font-bold tracking-[0.2em] text-sand-300/60">{style.label}</span>
          <span className="line-clamp-2 max-w-[10rem] font-display text-base font-semibold leading-tight text-sand-100 sm:text-lg">
            {item.name}
          </span>
          <span className="font-display text-2xl font-extrabold text-gradient-sunset sm:text-3xl">{item.points}</span>
          <span className="text-[11px] text-sand-300/50">pontos</span>
          <DeltaBadge delta={item.delta} />
        </div>
      </div>
    </button>
  )
}
