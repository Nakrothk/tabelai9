import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRankingData } from './hooks/useRankingData'
import { CategoryProvider } from './context/CategoryContext'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { HistoryPage } from './pages/HistoryPage'
import { StagePage } from './pages/StagePage'

const PlayerPage = lazy(() => import('./pages/PlayerPage').then((m) => ({ default: m.PlayerPage })))

function PageFallback() {
  return (
    <div className="flex justify-center py-24">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-sunset-500" />
    </div>
  )
}

export default function App() {
  const { data, loading, error } = useRankingData()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-sunset-500" />
          <p className="text-sm text-sand-300/50">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-sm text-sand-300/60">Não foi possível carregar o ranking agora. {error}</p>
      </div>
    )
  }

  return (
    <CategoryProvider data={data}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell data={data} />}>
            <Route index element={<HomePage data={data} />} />
            <Route
              path="jogadora/:playerId"
              element={
                <Suspense fallback={<PageFallback />}>
                  <PlayerPage data={data} />
                </Suspense>
              }
            />
            <Route path="historico" element={<HistoryPage data={data} />} />
            <Route path="historico/:stageId" element={<StagePage data={data} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CategoryProvider>
  )
}
