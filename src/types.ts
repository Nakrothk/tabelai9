/** Código da categoria (ex: "E", "D", "C"), descoberto dinamicamente a partir das abas da planilha. */
export type Category = string

export interface PlayerStagePoint {
  stageIndex: number
  played: boolean
  resultado: number
  vitorias: number
  pontos: number
  /** Pontuação total (bônus + pontos de games) acumulada até esta etapa, inclusive. */
  cumulativeTotal: number
  /** Posição no ranking geral da categoria, calculada como estava logo após esta etapa. */
  position: number | null
}

export interface Player {
  id: string
  name: string
  category: Category
  /** Posição atual (após a última etapa com resultado lançado). */
  position: number | null
  /** Posição antes da última etapa disputada — usada para calcular a seta de evolução. */
  previousPosition: number | null
  points: number
  bonusPoints: number
  gamesPoints: number
  wins: number
  stagesPlayed: number
  stages: PlayerStagePoint[]
}

export interface StageRankingEntry {
  playerId: string
  name: string
  resultado: number
  vitorias: number
  pontos: number
  position: number
}

export interface Stage {
  id: string
  category: Category
  index: number
  label: string
  date: string | null
  hasData: boolean
  ranking: StageRankingEntry[]
}

export interface CategoryData {
  category: Category
  players: Player[]
  stages: Stage[]
  leaderId: string | null
  risingPlayerId: string | null
  lastStageId: string | null
}

export interface RankingData {
  generatedAt: string
  sourceFile: string
  categories: Record<Category, CategoryData>
}

export function categoryLabel(c: Category): string {
  return `Super ${c}`
}
