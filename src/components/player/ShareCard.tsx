import { forwardRef } from 'react'
import { Trophy, Gift, Flame, CalendarCheck } from 'lucide-react'
import type { Player } from '../../types'
import { categoryLabel } from '../../types'
import { initials, ordinal } from '../../lib/format'
import { CircleBadge } from '../shared/CircleBadge'

const C = {
  bg1: '#1a2242',
  bg2: '#0b0f1a',
  bg3: '#2a1b28',
  ink800: '#121729',
  sand100: '#fbf3e6',
  sand200: '#f7ecd8',
  sunset400: '#ff8a65',
  sunset500: '#ff6b5b',
  gold400: '#ffd166',
  faint: 'rgba(237,217,174,0.5)',
}

/**
 * Card fora da tela (1080x1350, formato 4:5) usado só para gerar a imagem de
 * compartilhamento via html2canvas — por isso usa estilos inline com cores
 * sólidas em vez das classes utilitárias do Tailwind (que dependem de
 * color-mix/oklch e não são bem suportadas pelo html2canvas).
 */
export const ShareCard = forwardRef<HTMLDivElement, { player: Player }>(function ShareCard({ player }, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1350,
        padding: 72,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
            Super 8 · Feminino
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, textAlign: 'center' }}>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 9999,
            padding: 6,
            background: `linear-gradient(135deg, ${C.sunset500}, ${C.gold400})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircleBadge size={208} text={initials(player.name)} fontSize={72} background={C.ink800} color={C.sand200} />
        </div>

        <div>
          <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: 54, fontWeight: 700, color: C.sand100 }}>
            {player.name}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: C.faint }}>
            {categoryLabel(player.category)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: 140, fontWeight: 800, lineHeight: 1, color: C.sunset500 }}>
            {player.position ? ordinal(player.position) : '—'}
          </span>
          <span style={{ fontSize: 26, color: C.faint }}>lugar</span>
        </div>
        <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: 38, fontWeight: 700, color: C.sand100 }}>
          {player.points} pontos
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatTile icon={Trophy} label="Vitórias" value={player.wins} />
        <StatTile icon={Gift} label="Bônus" value={player.bonusPoints} />
        <StatTile icon={Flame} label="Pts. de games" value={player.gamesPoints} />
        <StatTile icon={CalendarCheck} label="Etapas" value={player.stagesPlayed} />
      </div>
    </div>
  )
})

function StatTile({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        padding: '28px 12px',
      }}
    >
      <Icon size={28} color={C.sunset400} />
      <span style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: 34, fontWeight: 700, color: C.sand200 }}>{value}</span>
      <span style={{ fontSize: 16, color: C.faint }}>{label}</span>
    </div>
  )
}
