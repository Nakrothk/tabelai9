import { useEffect, useState } from 'react'
import type { RankingData } from '../types'

interface State {
  data: RankingData | null
  loading: boolean
  error: string | null
}

export function useRankingData() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/ranking.json`, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao carregar dados (${res.status})`)
        return res.json()
      })
      .then((data: RankingData) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
