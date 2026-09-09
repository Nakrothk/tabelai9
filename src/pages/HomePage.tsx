import { useMemo, useState } from 'react'
import type { RankingData } from '../types'
import { useCategory } from '../context/CategoryContext'
import { UpdatedBadge } from '../components/layout/UpdatedBadge'
import { Highlights } from '../components/ranking/Highlights'
import { StageFilterChips } from '../components/ranking/StageFilterChips'
import { Podium } from '../components/ranking/Podium'
import { RankingList } from '../components/ranking/RankingList'
import { overallView, stageView } from '../lib/rankingView'

export function HomePage({ data }: { data: RankingData }) {
  const { category } = useCategory()
  const categoryData = data.categories[category]
  const [stageFilter, setStageFilter] = useState<number | 'all'>('all')

  const items = useMemo(() => {
    if (stageFilter === 'all') return overallView(categoryData.players)
    const stage = categoryData.stages.find((s) => s.index === stageFilter)
    return stage ? stageView(stage) : []
  }, [categoryData, stageFilter])

  if (categoryData.players.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <p className="font-display text-lg font-semibold text-sand-200">Sem dados para esta categoria ainda</p>
        <p className="text-sm text-sand-300/50">Assim que a primeira etapa for lançada, o ranking aparece aqui.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <UpdatedBadge generatedAt={data.generatedAt} />
      </div>

      <Highlights categoryData={categoryData} />

      <StageFilterChips stages={categoryData.stages} selected={stageFilter} onSelect={setStageFilter} />

      <section className="flex flex-col gap-6">
        <Podium items={items} />
        <RankingList items={items} />
      </section>
    </div>
  )
}
