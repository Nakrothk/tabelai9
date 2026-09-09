import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import type { RankingData } from '../types'
import { stageView } from '../lib/rankingView'
import { Podium } from '../components/ranking/Podium'
import { RankingList } from '../components/ranking/RankingList'

export function StagePage({ data }: { data: RankingData }) {
  const { stageId } = useParams()
  const navigate = useNavigate()

  const stage = Object.values(data.categories)
    .flatMap((c) => c.stages)
    .find((s) => s.id === stageId)

  if (!stage) {
    return (
      <div className="py-24 text-center text-sand-300/60">Etapa não encontrada.</div>
    )
  }

  const items = stageView(stage)

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/historico')}
        className="flex w-fit items-center gap-1 text-sm font-medium text-sand-300/60 hover:text-sand-100"
      >
        <ChevronLeft className="h-4 w-4" /> Histórico
      </button>

      <div>
        <h1 className="font-display text-2xl font-bold text-sand-100">{stage.label}</h1>
        <p className="text-sm text-sand-300/50">{stage.date ?? 'Data a definir'}</p>
      </div>

      {!stage.hasData ? (
        <p className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-6 text-center text-sm text-sand-300/60">
          Esta etapa ainda não teve resultados lançados.
        </p>
      ) : (
        <section className="flex flex-col gap-6">
          <Podium items={items} />
          <RankingList items={items} />
        </section>
      )}
    </div>
  )
}
