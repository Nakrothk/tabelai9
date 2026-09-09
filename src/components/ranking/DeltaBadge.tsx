import { ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react'
import type { Delta } from '../../lib/rankingView'

export function DeltaBadge({ delta }: { delta?: Delta }) {
  if (!delta || delta.direction === 'none') return null

  if (delta.direction === 'new') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-lime-400/15 px-2 py-1 text-[11px] font-semibold text-lime-400">
        <Sparkles className="h-3 w-3" /> NOVA
      </span>
    )
  }
  if (delta.direction === 'same') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[11px] font-semibold text-sand-300/50">
        <Minus className="h-3 w-3" /> —
      </span>
    )
  }
  const isUp = delta.direction === 'up'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
        isUp ? 'bg-lime-400/15 text-lime-400' : 'bg-sunset-600/15 text-sunset-400'
      }`}
    >
      {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {delta.amount}
    </span>
  )
}
