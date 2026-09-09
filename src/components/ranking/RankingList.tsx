import type { RankingViewItem } from '../../lib/rankingView'
import { RankingRow } from './RankingRow'

export function RankingList({ items }: { items: RankingViewItem[] }) {
  const rest = items.slice(3)
  if (rest.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {rest.map((item, i) => (
        <RankingRow key={item.id} item={item} index={i} />
      ))}
    </div>
  )
}
