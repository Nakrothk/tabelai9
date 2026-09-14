#!/usr/bin/env node
/**
 * Baixa a planilha oficial a partir de um link de compartilhamento do Google Sheets
 * ("qualquer pessoa com o link pode visualizar") e salva em data/source/,
 * para o sync.mjs processar em seguida.
 *
 * Usa a exportação pública do Google Sheets em formato .xlsx (sem autenticação),
 * que funciona para qualquer planilha compartilhada como "qualquer pessoa com o link".
 *
 * Uso:
 *   GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/XXXX/edit" node scripts/fetch-source.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_PATH = path.join(ROOT, 'data', 'source', 'google-sheets-download.xlsx')

function extractSheetId(url) {
  const m = url.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!m) throw new Error('Não foi possível extrair o ID da planilha a partir do link informado. Use o link completo de compartilhamento do Google Sheets.')
  return m[1]
}

async function download(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar ${url}`)
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('text/html')) {
    throw new Error('Resposta parece ser uma página HTML, não um arquivo .xlsx (link inválido ou planilha sem permissão de visualização pública).')
  }
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const shareUrl = process.env.GOOGLE_SHEET_URL
  if (!shareUrl) {
    throw new Error('Defina a variável de ambiente GOOGLE_SHEET_URL com o link de compartilhamento do Google Sheets.')
  }

  mkdirSync(path.dirname(OUT_PATH), { recursive: true })

  const sheetId = extractSheetId(shareUrl)
  const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`

  console.log('Baixando via docs.google.com/export...')
  const buffer = await download(exportUrl)

  writeFileSync(OUT_PATH, buffer)
  console.log(`OK -> ${OUT_PATH} (${(buffer.length / 1024).toFixed(0)} KB)`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
