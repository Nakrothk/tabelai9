import type { Player, Stage } from '../types'
import { positionDelta } from './format'

export interface Delta {
  direction: 'up' | 'down' | 'same' | 'new' | 'none'
  amount: number
}

export interface RankingViewItem {
  id: string
  name: string
  position: number
  points: number
  meta: string
  delta?: Delta
}

export function overallView(players: Player[]): RankingViewItem[] {
  return players
    .filter((p): p is Player & { position: number } => p.position != null)
    .map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      points: p.points,
      meta: `${p.wins} vitórias · ${p.stagesPlayed} etapas`,
      delta: positionDelta(p.position, p.previousPosition),
    }))
}

export function stageView(stage: Stage): RankingViewItem[] {
  return stage.ranking.map((r) => ({
    id: r.playerId,
    name: r.name,
    position: r.position,
    points: r.pontos,
    meta: `${r.vitorias} vitórias · ${r.resultado} games`,
  }))
}
