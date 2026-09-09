#!/usr/bin/env node
/**
 * Baixa o Excel oficial a partir de um link de compartilhamento do OneDrive
 * ("qualquer pessoa com o link pode visualizar") e salva em data/source/,
 * para o sync.mjs processar em seguida.
 *
 * Usa a API pública de compartilhamento da Microsoft (sem autenticação),
 * que funciona para qualquer link "somente visualização" do OneDrive pessoal:
 * https://learn.microsoft.com/onedrive/developer/rest-api/api/shares_get
 *
 * Uso:
 *   ONEDRIVE_SHARE_URL="https://1drv.ms/x/s!...." node scripts/fetch-source.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_PATH = path.join(ROOT, 'data', 'source', 'onedrive-download.xlsx')

function encodeSharingUrl(url) {
  const base64 = Buffer.from(url.trim(), 'utf-8').toString('base64')
  const urlSafe = base64.replace(/=+$/, '').replace(/\//g, '_').replace(/\+/g, '-')
  return `u!${urlSafe}`
}

async function download(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar ${url}`)
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('text/html')) {
    throw new Error('Resposta parece ser uma página HTML, não um arquivo .xlsx (link de compartilhamento inválido ou sem permissão de visualização pública).')
  }
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const shareUrl = process.env.ONEDRIVE_SHARE_URL
  if (!shareUrl) {
    throw new Error('Defina a variável de ambiente ONEDRIVE_SHARE_URL com o link de compartilhamento do OneDrive.')
  }

  mkdirSync(path.dirname(OUT_PATH), { recursive: true })

  const encoded = encodeSharingUrl(shareUrl)
  const apiUrl = `https://api.onedrive.com/v1.0/shares/${encoded}/root/content`

  let buffer
  try {
    console.log('Baixando via api.onedrive.com...')
    buffer = await download(apiUrl)
  } catch (err) {
    console.warn(`Falhou (${err.message}). Tentando link direto com ?download=1...`)
    const direct = shareUrl.includes('?') ? `${shareUrl}&download=1` : `${shareUrl}?download=1`
    buffer = await download(direct)
  }

  writeFileSync(OUT_PATH, buffer)
  console.log(`OK -> ${OUT_PATH} (${(buffer.length / 1024).toFixed(0)} KB)`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
