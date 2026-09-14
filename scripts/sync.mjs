#!/usr/bin/env node
/**
 * Sincroniza o ranking Beach Tennis a partir da planilha oficial (Google Sheets, "Super 8 - Fem").
 *
 * As categorias são descobertas automaticamente: qualquer aba chamada "Super ( X )" vira uma
 * categoria "X" no ranking, sem precisar mexer no código quando surgir uma nova (ex: "Super ( B )").
 * Fonte oficial dos dados: dentro de cada aba dessas, o bloco de ranking consolidado no final
 * (título "SUPER X"), que já contém as fórmulas e a pontuação oficial calculada.
 * Os cabeçalhos de semana desse bloco às vezes ficam desatualizados — a data real de cada semana/etapa
 * é obtida à parte, lendo os rótulos "SEMANA N ( data )" no topo da própria aba.
 *
 * Nenhuma regra de pontuação é recriada: pontos por etapa, bônus de participação e o total
 * (bônus + soma de pontos) são lidos diretamente dos valores/fórmulas já calculados na planilha.
 * A única coisa "derivada" é a ordenação (ranking) e o corte progressivo por etapa, usados
 * para calcular posição atual, posição anterior e evolução — usando a mesma matemática oficial
 * aplicada em cada corte no tempo, sem inventar pontuação nova.
 *
 * Uso:
 *   node scripts/sync.mjs [caminho-para-o-arquivo.xlsx]
 *
 * Se nenhum caminho for informado, procura em data/source/*.xlsx.
 */
import ExcelJS from 'exceljs'
import { readdirSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_PATH = path.join(ROOT, 'public', 'data', 'ranking.json')
const SOURCE_DIR = path.join(ROOT, 'data', 'source')

// Reconhece abas como "Super ( E )", "Super(B)", etc. — o texto entre parênteses vira o código da categoria.
const CATEGORY_SHEET_PATTERN = /^super\s*\(\s*([^)]+?)\s*\)$/i
const MAX_STAGES = 8

// Colunas fixas do bloco de ranking consolidado (1-based). C=jogadores.
const NAME_COL = 3
// Para cada etapa: [Resultado, Vitória, Pontos]
const STAGE_COLS = Array.from({ length: MAX_STAGES }, (_, i) => [4 + i * 3, 5 + i * 3, 6 + i * 3])
const BONUS_COL = 28 // AB
const TOTAL_VITORIAS_COL = 29 // AC
const GAMES_POINTS_COL = 30 // AD
const TOTAL_COL = 31 // AE

// Bônus por etapas jogadas, conforme a tabela de referência da própria planilha (AJ/AK).
function bonusForStagesPlayed(n) {
  if (n <= 0) return 0
  if (n === 1) return 0
  if (n === 2) return 15
  if (n === 3) return 35
  return 65
}

function cellVal(cell) {
  if (!cell) return null
  const v = cell.value
  if (v === null || v === undefined) return null
  if (typeof v === 'object') {
    if ('result' in v) return v.result ?? null
    if ('richText' in v) return v.richText.map((t) => t.text).join('')
    if (v instanceof Date) return v
  }
  return v
}

function numOrNull(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function findSourceFile(argPath) {
  if (argPath) return path.resolve(argPath)
  if (existsSync(SOURCE_DIR)) {
    const found = readdirSync(SOURCE_DIR).find((f) => f.toLowerCase().endsWith('.xlsx'))
    if (found) return path.join(SOURCE_DIR, found)
  }
  throw new Error(
    `Nenhum arquivo .xlsx informado e nenhum encontrado em ${SOURCE_DIR}.\nUso: node scripts/sync.mjs caminho/para/arquivo.xlsx`,
  )
}

/** Extrai o mapa etapaIndex -> data real (string 'DD/MM' ou null) lendo os rótulos "SEMANA N ( data )" da aba. */
function extractStageDates(sheet) {
  const dates = {}
  if (!sheet) return dates
  sheet.eachRow((row) => {
    for (let c = 1; c <= sheet.columnCount; c++) {
      const label = cellVal(row.getCell(c))
      if (typeof label !== 'string') continue
      const m = label.match(/SEMANA\s*(\d+)\s*\(\s*([^)]*)\)/i)
      if (!m) continue
      const idx = Number(m[1])
      const rawDate = m[2].trim()
      dates[idx] = /^data$/i.test(rawDate) || rawDate === '' || /^00/.test(rawDate) ? null : rawDate
      break
    }
  })
  return dates
}

/** Encontra as linhas de título ("SUPER X") do bloco de ranking consolidado dentro de uma aba. */
function findCategoryBlocks(sheet) {
  const blocks = []
  sheet.eachRow((row, rowNumber) => {
    const label = cellVal(row.getCell(NAME_COL))
    if (typeof label !== 'string') return
    const m = label.trim().match(/^SUPER\s+([A-Za-zÀ-ÿ0-9]+)$/i)
    if (m) blocks.push({ category: m[1].toUpperCase(), titleRow: rowNumber })
  })
  return blocks
}

/** Descobre dinamicamente todas as abas de categoria ("Super ( X )") presentes na planilha. */
function discoverCategorySheets(workbook) {
  const found = []
  workbook.eachSheet((sheet) => {
    const m = sheet.name.trim().match(CATEGORY_SHEET_PATTERN)
    if (m) found.push({ category: m[1].trim().toUpperCase(), sheet })
  })
  return found
}

function parseCategoryBlock(sheet, block, nextTitleRow, stageDates) {
  const { category, titleRow } = block
  const dataStart = titleRow + 4
  const dataEnd = (nextTitleRow ?? sheet.rowCount + 1) - 1

  const rawPlayers = []
  let emptyStreak = 0
  for (let r = dataStart; r <= dataEnd; r++) {
    const row = sheet.getRow(r)
    const name = cellVal(row.getCell(NAME_COL))
    if (typeof name !== 'string' || !name.trim()) {
      emptyStreak++
      if (emptyStreak >= 4) break
      continue
    }
    emptyStreak = 0
    rawPlayers.push({ row: r, name: name.trim() })
  }

  // Etapas com pelo menos um resultado lançado.
  const stageHasData = STAGE_COLS.map(([resultCol]) =>
    rawPlayers.some((p) => numOrNull(cellVal(sheet.getRow(p.row).getCell(resultCol))) !== null),
  )
  let maxStageIndex = 0
  stageHasData.forEach((has, i) => {
    if (has) maxStageIndex = i + 1
  })
  // Inclui também etapas já agendadas (com data real) mesmo sem resultado ainda, para exibir em "próximas".
  for (let i = 0; i < MAX_STAGES; i++) {
    if (stageDates[i + 1] && i + 1 > maxStageIndex) maxStageIndex = i + 1
  }

  const stageIndexes = Array.from({ length: maxStageIndex }, (_, i) => i + 1)

  const players = rawPlayers.map(({ row, name }) => {
    const wsRow = sheet.getRow(row)
    const perStage = stageIndexes.map((stageIndex) => {
      const [rc, vc, pc] = STAGE_COLS[stageIndex - 1]
      const resultado = numOrNull(cellVal(wsRow.getCell(rc)))
      const vitorias = numOrNull(cellVal(wsRow.getCell(vc)))
      const pontos = numOrNull(cellVal(wsRow.getCell(pc)))
      return {
        stageIndex,
        played: resultado !== null,
        resultado: resultado ?? 0,
        vitorias: vitorias ?? 0,
        pontos: pontos ?? 0,
      }
    })

    return {
      id: `${category.toLowerCase()}-${slugify(name)}`,
      name,
      category,
      perStage,
      finalBonus: numOrNull(cellVal(wsRow.getCell(BONUS_COL))) ?? 0,
      finalWins: numOrNull(cellVal(wsRow.getCell(TOTAL_VITORIAS_COL))) ?? 0,
      finalGamesPoints: numOrNull(cellVal(wsRow.getCell(GAMES_POINTS_COL))) ?? 0,
      finalTotal: numOrNull(cellVal(wsRow.getCell(TOTAL_COL))) ?? 0,
    }
  })

  // Filtra jogadoras que nunca entraram em quadra (linhas fantasmas de fórmula).
  const active = players.filter((p) => p.perStage.some((s) => s.played))

  // Calcula, para cada corte de etapa (1..maxStageIndex), o total acumulado e o ranking.
  const cutpointRankings = {} // stageIndex -> [{playerId, position}]
  for (const stageIndex of stageIndexes) {
    const snapshot = active
      .map((p) => {
        const playedSoFar = p.perStage.filter((s) => s.stageIndex <= stageIndex && s.played)
        const stagesPlayed = playedSoFar.length
        if (stagesPlayed === 0) return null
        const gamesPoints = playedSoFar.reduce((acc, s) => acc + s.pontos, 0)
        const wins = playedSoFar.reduce((acc, s) => acc + s.vitorias, 0)
        const bonus = bonusForStagesPlayed(stagesPlayed)
        return { id: p.id, name: p.name, total: bonus + gamesPoints, gamesPoints, wins }
      })
      .filter(Boolean)
      .sort((a, b) => b.total - a.total || b.gamesPoints - a.gamesPoints || b.wins - a.wins || a.name.localeCompare(b.name))

    cutpointRankings[stageIndex] = snapshot.map((s, i) => ({ ...s, position: i + 1 }))
  }

  const lastStageIndex = maxStageIndex > 0 ? Math.max(...stageIndexes.filter((i) => stageHasData[i - 1])) : 0
  const prevStageIndex = stageIndexes.filter((i) => i < lastStageIndex && stageHasData[i - 1]).pop() ?? null

  const positionOf = (stageIndex, playerId) => {
    if (!stageIndex) return null
    const found = cutpointRankings[stageIndex]?.find((p) => p.id === playerId)
    return found ? found.position : null
  }

  const finalPlayers = active
    .map((p) => {
      const stagesPlayed = p.perStage.filter((s) => s.played).length
      const stagesWithPosition = p.perStage.map((s) => ({
        ...s,
        cumulativePoints: cutpointsSum(p, s.stageIndex, 'pontos'),
        cumulativeBonus: bonusForStagesPlayed(p.perStage.filter((x) => x.stageIndex <= s.stageIndex && x.played).length),
        position: positionOf(s.stageIndex, p.id),
      }))
      return {
        id: p.id,
        name: p.name,
        category,
        stagesPlayed,
        bonusPoints: p.finalBonus,
        gamesPoints: p.finalGamesPoints,
        wins: p.finalWins,
        points: p.finalTotal,
        position: positionOf(lastStageIndex, p.id),
        previousPosition: positionOf(prevStageIndex, p.id),
        stages: stagesWithPosition.map((s) => ({
          stageIndex: s.stageIndex,
          played: s.played,
          resultado: s.resultado,
          vitorias: s.vitorias,
          pontos: s.pontos,
          cumulativeTotal: s.cumulativeBonus + s.cumulativePoints,
          position: s.position,
        })),
      }
    })
    .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))

  const stages = stageIndexes.map((stageIndex) => {
    const hasData = stageHasData[stageIndex - 1]
    const date = stageDates[stageIndex] ?? null
    const ranking = hasData
      ? active
          .map((p) => {
            const s = p.perStage.find((x) => x.stageIndex === stageIndex)
            if (!s || !s.played) return null
            return { playerId: p.id, name: p.name, resultado: s.resultado, vitorias: s.vitorias, pontos: s.pontos }
          })
          .filter(Boolean)
          .sort((a, b) => b.pontos - a.pontos || b.resultado - a.resultado || b.vitorias - a.vitorias || a.name.localeCompare(b.name))
          .map((r, i) => ({ ...r, position: i + 1 }))
      : []
    return {
      id: `${category}${stageIndex}`,
      category,
      index: stageIndex,
      label: `Etapa ${stageIndex}`,
      date,
      hasData,
      ranking,
    }
  })

  return { category, players: finalPlayers, stages }
}

function cutpointsSum(player, uptoStageIndex, field) {
  return player.perStage
    .filter((s) => s.stageIndex <= uptoStageIndex && s.played)
    .reduce((acc, s) => acc + s[field], 0)
}

function computeHighlights(categoryData) {
  const { players, stages } = categoryData
  const leader = players.find((p) => p.position === 1) ?? null
  const playedStages = stages.filter((s) => s.hasData)
  const lastStage = playedStages[playedStages.length - 1] ?? null

  let risingPlayerId = null
  if (lastStage) {
    let best = null
    for (const p of players) {
      const stageEntry = p.stages.find((s) => s.stageIndex === lastStage.index)
      if (!stageEntry?.played || p.previousPosition == null || p.position == null) continue
      const gain = p.previousPosition - p.position
      if (gain > 0 && (!best || gain > best.gain)) best = { id: p.id, gain }
    }
    risingPlayerId = best?.id ?? null
  }

  return {
    leaderId: leader?.id ?? null,
    risingPlayerId,
    lastStageId: lastStage?.id ?? null,
  }
}

async function main() {
  const argPath = process.argv[2]
  const sourceFile = findSourceFile(argPath)
  console.log(`Lendo: ${sourceFile}`)

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(sourceFile)

  const categorySheets = discoverCategorySheets(workbook)
  if (categorySheets.length === 0) {
    throw new Error('Nenhuma aba "Super ( X )" encontrada na planilha.')
  }

  const categories = {}
  for (const { category, sheet } of categorySheets) {
    const stageDates = extractStageDates(sheet)
    const block = findCategoryBlocks(sheet).find((b) => b.category === category)
    if (!block) throw new Error(`Bloco "SUPER ${category}" não encontrado na aba "${sheet.name}".`)

    const parsed = parseCategoryBlock(sheet, block, undefined, stageDates)
    const highlights = computeHighlights(parsed)
    categories[category] = { ...parsed, ...highlights }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.basename(sourceFile),
    categories,
  }

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`OK -> ${OUT_PATH}`)
  for (const cat of Object.keys(categories)) {
    const c = categories[cat]
    console.log(`  Super ${cat}: ${c.players.length} jogadoras, ${c.stages.filter((s) => s.hasData).length} etapas com dados`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
