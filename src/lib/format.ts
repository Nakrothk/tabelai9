export function ordinal(n: number): string {
  return `${n}º`
}

export function formatUpdatedAt(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date} às ${time}`
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function positionDelta(position: number | null, previousPosition: number | null) {
  if (position == null) return { direction: 'none' as const, amount: 0 }
  if (previousPosition == null) return { direction: 'new' as const, amount: 0 }
  const diff = previousPosition - position
  if (diff > 0) return { direction: 'up' as const, amount: diff }
  if (diff < 0) return { direction: 'down' as const, amount: -diff }
  return { direction: 'same' as const, amount: 0 }
}
