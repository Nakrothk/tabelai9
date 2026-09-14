import { useCategory } from '../../context/CategoryContext'

export function CategoryTabs() {
  const { category, setCategory, availableCategories } = useCategory()

  return (
    <div className="flex gap-1.5 rounded-full bg-ink-800/70 p-1.5 glass-panel">
      {availableCategories.map((c) => (
        <button
          key={c}
          onClick={() => setCategory(c)}
          className={`relative rounded-full px-4 py-2 font-display text-sm font-semibold tracking-wide transition-all duration-300 ${
            category === c
              ? 'bg-gradient-to-br from-sunset-500 to-gold-400 text-ink-950 shadow-[0_4px_18px_-4px_rgba(255,107,91,0.6)]'
              : 'text-sand-300/70 hover:text-sand-200'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
