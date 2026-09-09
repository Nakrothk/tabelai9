import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PlayerStagePoint } from '../../types'

export function EvolutionChart({ stages }: { stages: PlayerStagePoint[] }) {
  const played = stages.filter((s) => s.played)
  if (played.length < 2) {
    return (
      <p className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-6 text-center text-sm text-sand-300/50">
        A evolução aparece a partir da 2ª etapa disputada.
      </p>
    )
  }

  const chartData = played.map((s) => ({
    label: `Etapa ${s.stageIndex}`,
    total: s.cumulativeTotal,
    position: s.position,
  }))

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -4, bottom: 0 }}>
          <defs>
            <linearGradient id="evolutionFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8a65" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#ff8a65" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            interval={0}
            tick={{ fill: '#9aa0ad', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#9aa0ad', fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#ff6b5b"
            strokeWidth={2.5}
            fill="url(#evolutionFill)"
            dot={{ r: 3.5, fill: '#ff6b5b', strokeWidth: 0 }}
            activeDot={{ r: 5.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-xl border border-white/10 bg-ink-800/95 px-3 py-2 text-xs shadow-xl">
      <p className="font-display font-semibold text-sand-100">{label}</p>
      <p className="text-sand-300/70">{point.total} pts acumulados</p>
      {point.position && <p className="text-sand-300/50">{point.position}º lugar na época</p>}
    </div>
  )
}
