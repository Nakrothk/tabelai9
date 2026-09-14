import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Share2 } from 'lucide-react'
import type { RankingData } from '../types'
import { stageView } from '../lib/rankingView'
import { Podium } from '../components/ranking/Podium'
import { RankingList } from '../components/ranking/RankingList'
import { StageShareCard } from '../components/ranking/StageShareCard'
import { exportNodeAsImage } from '../lib/shareImage'

export function StagePage({ data }: { data: RankingData }) {
  const { stageId } = useParams()
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const stage = Object.values(data.categories)
    .flatMap((c) => c.stages)
    .find((s) => s.id === stageId)

  if (!stage) {
    return (
      <div className="py-24 text-center text-sand-300/60">Etapa não encontrada.</div>
    )
  }

  const items = stageView(stage)

  const handleShare = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      await exportNodeAsImage(cardRef.current, `${stage.id}-super8.png`)
    } catch (err) {
      console.error('Falha ao gerar imagem de compartilhamento', err)
    } finally {
      setExporting(false)
    }
  }

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
          <button
            onClick={handleShare}
            disabled={exporting}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-sand-100 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" />
            {exporting ? 'Gerando imagem...' : 'Compartilhar etapa'}
          </button>
          <Podium items={items} />
          <RankingList items={items} />
        </section>
      )}

      {stage.hasData && (
        <div style={{ position: 'fixed', top: 0, left: -99999, pointerEvents: 'none' }} aria-hidden="true">
          <StageShareCard ref={cardRef} stage={stage} />
        </div>
      )}
    </div>
  )
}
