import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { SearchOverlay } from '../search/SearchOverlay'
import type { RankingData } from '../../types'

export function AppShell({ data }: { data: RankingData }) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="grain-overlay" />
      <TopBar onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-5 sm:pb-10">
        <Outlet />
      </main>
      <BottomNav />
      {searchOpen && <SearchOverlay data={data} onClose={() => setSearchOpen(false)} />}
    </div>
  )
}
