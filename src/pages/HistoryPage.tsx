import { useNavigate } from 'react-router-dom'
import { ChevronRight, CalendarDays } from 'lucide-react'
import type { RankingData } from '../types'
import { useCategory } from '../context/CategoryContext'

export function HistoryPage({ data }: { data: RankingData }) {
  const { category } = useCategory()
  const categoryData = data.categories[category]
  const navigate = useNavigate()

  if (categoryData.stages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <p className="font-display text-lg font-semibold text-sand-200">Nenhuma etapa cadastrada ainda</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-xl font-bold text-sand-100">Histórico de etapas</h1>
      <div className="flex flex-col gap-2.5">
        {categoryData.stages.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => navigate(`/historico/${stage.id}`)}
            style={{ animationDelay: `${i * 50}ms` }}
            className="animate-fade-up flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.06]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-700 text-sand-300/70">
              <CalendarDays className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-bold text-sand-100">{stage.label}</span>
              <span className="block text-xs text-sand-300/50">{stage.date ?? 'Data a definir'}</span>
            </span>
            <StatusChip stage={stage} />
            <ChevronRight className="h-4 w-4 shrink-0 text-sand-300/30" />
          </button>
        ))}
      </div>
    </div>
  )
}

function StatusChip({ stage }: { stage: RankingData['categories'][keyof RankingData['categories']]['stages'][number] }) {
  if (stage.hasData) {
    return (
      <span className="shrink-0 rounded-full bg-lime-400/15 px-2.5 py-1 text-[11px] font-semibold text-lime-400">
        Concluída
      </span>
    )
  }
  return (
    <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-sand-300/50">
      Agendada
    </span>
  )
}
