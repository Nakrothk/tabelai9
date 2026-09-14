import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import type { RankingData } from '../../types'
import { categoryLabel } from '../../types'
import { initials, ordinal } from '../../lib/format'

export function SearchOverlay({ data, onClose }: { data: RankingData; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = Object.values(data.categories).flatMap((c) => c.players)
    if (!q) return all.slice(0, 0)
    return all.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 30)
  }, [data, query])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink-950/97 backdrop-blur-sm animate-fade-up">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <Search className="h-5 w-5 shrink-0 text-sand-300/60" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar jogadora..."
          className="w-full bg-transparent font-display text-lg text-sand-200 placeholder:text-sand-300/40 focus:outline-none"
        />
        <button onClick={onClose} className="rounded-full p-2 text-sand-300/70 hover:bg-white/10 hover:text-sand-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {query.trim() === '' && (
          <p className="px-4 py-8 text-center text-sm text-sand-300/50">Digite o nome de uma jogadora para buscar em todas as categorias.</p>
        )}
        {query.trim() !== '' && results.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-sand-300/50">Nenhuma jogadora encontrada para "{query}".</p>
        )}
        <ul className="flex flex-col gap-1">
          {results.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => {
                  navigate(`/jogadora/${p.id}`)
                  onClose()
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-700 font-display text-sm font-semibold text-sand-200">
                  {initials(p.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-sand-100">{p.name}</span>
                  <span className="block text-xs text-sand-300/50">
                    {categoryLabel(p.category)} · {p.position ? `${ordinal(p.position)} lugar` : 'sem posição'}
                  </span>
                </span>
                <span className="shrink-0 font-display text-sm text-sunset-400">{p.points} pts</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
