import { forwardRef } from 'react'
import type { Stage } from '../../types'
import { categoryLabel } from '../../types'
import { initials } from '../../lib/format'
import { CircleBadge } from '../shared/CircleBadge'

const C = {
  bg1: '#1a2242',
  bg2: '#0b0f1a',
  bg3: '#2a1b28',
  ink800: '#121729',
  sand100: '#fbf3e6',
  sand200: '#f7ecd8',
  sunset500: '#ff6b5b',
  gold400: '#ffd166',
  faint: 'rgba(237,217,174,0.5)',
  rowBg: 'rgba(255,255,255,0.04)',
  rowBorder: 'rgba(255,255,255,0.08)',
}

const MEDAL_COLOR: Record<number, string> = {
  1: C.gold400,
  2: '#cbd5e1',
  3: '#e0a45c',
}

/**
 * Card fora da tela (1080x1350) usado só para gerar a imagem de compartilhamento
 * do top 8 de uma etapa via html2canvas — mesma técnica do ShareCard de jogadora
 * (estilos inline com cores sólidas, sem depender de color-mix/oklch).
 */
export const StageShareCard = forwardRef<HTMLDivElement, { stage: Stage }>(function StageShareCard({ stage }, ref) {
  const top8 = stage.ranking.slice(0, 8)

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1350,
        padding: 72,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        background: `linear-gradient(160deg, ${C.bg1} 0%, ${C.bg2} 55%, ${C.bg3} 100%)`,
        fontFamily: '"Inter", system-ui, sans-serif',
        color: C.sand200,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 22,
            background: `linear-gradient(135deg, ${C.sunset500}, ${C.gold400})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 14,
            flexShrink: 0,
          }}
        >
          <img src="/i9-badge.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
          <span style={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, fontSize: 32, color: C.sand100 }}>
            RANKING SUPER 8 - INOVE
          </span>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: C.faint }}>
            {categoryLabel(stage.category)}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: 56, fontWeight: 700, color: C.sand100 }}>
          {stage.label}
        </div>
        <div style={{ fontSize: 20, color: C.faint }}>{stage.date ?? 'Data a definir'}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
        {top8.map((r) => (
          <div
            key={r.playerId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              borderRadius: 20,
              border: `1px solid ${C.rowBorder}`,
              background: C.rowBg,
              padding: '18px 24px',
            }}
          >
            <CircleBadge
              size={56}
              text={r.position}
              fontSize={26}
              background={MEDAL_COLOR[r.position] ?? C.ink800}
              color={MEDAL_COLOR[r.position] ? C.ink800 : C.sand200}
            />

            <CircleBadge size={56} text={initials(r.name)} fontSize={20} background={C.ink800} color={C.sand200} />

            <span
              style={{
                flex: 1,
                fontFamily: '"Rajdhani", sans-serif',
                fontSize: 30,
                lineHeight: 1,
                fontWeight: 700,
                color: C.sand100,
                position: 'relative',
                top: -16,
              }}
            >
              {r.name}
            </span>

            <span
              style={{
                fontFamily: '"Rajdhani", sans-serif',
                fontSize: 32,
                lineHeight: 1,
                fontWeight: 800,
                color: C.sunset500,
                position: 'relative',
                top: -19,
              }}
            >
              {r.pontos} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
