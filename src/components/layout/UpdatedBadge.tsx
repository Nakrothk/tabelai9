import { formatUpdatedAt } from '../../lib/format'

export function UpdatedBadge({ generatedAt }: { generatedAt: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-sand-300/70">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
      </span>
      Atualizado em {formatUpdatedAt(generatedAt)}
    </div>
  )
}
