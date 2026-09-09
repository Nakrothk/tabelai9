import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Category, RankingData } from '../types'
import { CATEGORIES } from '../types'

interface CategoryContextValue {
  category: Category
  setCategory: (c: Category) => void
  availableCategories: Category[]
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

const STORAGE_KEY = 'ranking-bt:category'

export function CategoryProvider({ data, children }: { data: RankingData | null; children: ReactNode }) {
  const availableCategories = useMemo(
    () => (data ? CATEGORIES.filter((c) => data.categories[c]?.players.length > 0) : CATEGORIES),
    [data],
  )

  const [category, setCategoryState] = useState<Category>(() => {
    if (typeof window === 'undefined') return 'E'
    const stored = window.localStorage.getItem(STORAGE_KEY) as Category | null
    return stored ?? 'E'
  })

  useEffect(() => {
    if (!availableCategories.includes(category) && availableCategories.length > 0) {
      setCategoryState(availableCategories[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCategories.join(',')])

  const setCategory = (c: Category) => {
    setCategoryState(c)
    window.localStorage.setItem(STORAGE_KEY, c)
  }

  return (
    <CategoryContext.Provider value={{ category, setCategory, availableCategories }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategory() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategory deve ser usado dentro de CategoryProvider')
  return ctx
}
