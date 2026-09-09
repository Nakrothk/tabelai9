import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Trophy, Flame, Gift, CalendarCheck } from 'lucide-react'
import type { RankingData } from '../types'
import { CATEGORY_LABEL } from '../types'
import { initials, ordinal, positionDelta } from '../lib/format'
import { DeltaBadge } from '../components/ranking/DeltaBadge'
import { EvolutionChart } from '../components/player/EvolutionChart'

export function PlayerPage({ data }: { data: RankingData }) {
  const { playerId } = useParams()
  const navigate = useNavigate()

  const player = Object.values(data.categories)
    .flatMap((c) => c.players)
    .find((p) => p.id === playerId)

  if (!player) {
    return <div className="py-24 text-center text-sand-300/60">Jogadora não encontrada.</div>
  }

  const delta = positionDelta(player.position, player.previousPosition)

  return (
    <div className="flex flex-col gap-7">
      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1 text-sm font-medium text-sand-300/60 hover:text-sand-100"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <section className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sunset-500 to-gold-400 p-[3px]">
          <span className="flex h-full w-full items-center justify-center rounded-full bg-ink-800 font-display text-3xl font-bold text-sand-100">
            {initials(player.name)}
          </span>
        </span>
        <div>
          <p className="font-display text-2xl font-bold text-sand-100">{player.name}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-300/50">
            {CATEGORY_LABEL[player.category]}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-extrabold text-gradient-sunset">
            {player.position ? ordinal(player.position) : '—'}
          </span>
          <span className="text-sm text-sand-300/50">lugar</span>
        </div>
        <p className="font-display text-xl font-semibold text-sand-100">{player.points} pontos</p>
        <DeltaBadge delta={delta} />
      </section>

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile icon={Trophy} label="Vitórias" value={player.wins} />
        <StatTile icon={Gift} label="Bônus" value={player.bonusPoints} />
        <StatTile icon={Flame} label="Pts. de games" value={player.gamesPoints} />
        <StatTile icon={CalendarCheck} label="Etapas jogadas" value={player.stagesPlayed} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-sand-100">Evolução</h2>
        <EvolutionChart stages={player.stages} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-sand-100">Resultados por etapa</h2>
        <div className="flex flex-col gap-2">
          {player.stages.map((s) => (
            <div
              key={s.stageIndex}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                s.played ? 'border-white/5 bg-white/[0.03]' : 'border-white/5 bg-transparent opacity-40'
              }`}
            >
              <span className="w-16 shrink-0 font-display text-sm font-bold text-sand-300/60">
                Etapa {s.stageIndex}
              </span>
              {s.played ? (
                <>
                  <span className="flex-1 text-xs text-sand-300/50">
                    {s.resultado} games · {s.vitorias} vitórias
                  </span>
                  <span className="shrink-0 font-display text-base font-bold text-sand-100">+{s.pontos} pts</span>
                  {s.position && (
                    <span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[11px] font-semibold text-sand-300/60">
                      {ordinal(s.position)}
                    </span>
                  )}
                </>
              ) : (
                <span className="flex-1 text-xs text-sand-300/40">Não disputada</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-4 text-center">
      <Icon className="h-4.5 w-4.5 text-sunset-400" />
      <span className="font-display text-xl font-bold text-sand-100">{value}</span>
      <span className="text-[11px] text-sand-300/50">{label}</span>
    </div>
  )
}
