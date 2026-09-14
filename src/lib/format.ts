export function ordinal(n: number): string {
  return `${n}º`
}

export function formatUpdatedAt(iso: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(iso).getTime())
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'agora mesmo'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.floor(hours / 24)
  return `há ${days} d`
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
