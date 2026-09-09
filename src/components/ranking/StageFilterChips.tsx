import type { Stage } from '../../types'

export function StageFilterChips({
  stages,
  selected,
  onSelect,
}: {
  stages: Stage[]
  selected: number | 'all'
  onSelect: (value: number | 'all') => void
}) {
  const playable = stages.filter((s) => s.hasData)

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip active={selected === 'all'} onClick={() => onSelect('all')}>
        Geral
      </Chip>
      {playable.map((s) => (
        <Chip key={s.id} active={selected === s.index} onClick={() => onSelect(s.index)}>
          Etapa {s.index}
        </Chip>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
        active
          ? 'border-transparent bg-sand-200 text-ink-950'
          : 'border-white/10 bg-white/[0.03] text-sand-300/60 hover:text-sand-200'
      }`}
    >
      {children}
    </button>
  )
}
