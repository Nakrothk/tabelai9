/**
 * Círculo com texto centralizado, renderizado em SVG.
 *
 * Usado nos cards de compartilhamento (html2canvas): centralizar texto num
 * círculo via CSS (flex ou position:absolute + transform) não é confiável no
 * html2canvas com fontes customizadas — o texto acaba desalinhado verticalmente.
 * SVG com `text-anchor`/`dominant-baseline` centraliza por coordenada, sem
 * depender de métricas de fonte calculadas pelo layout HTML.
 */
export function CircleBadge({
  size,
  text,
  fontSize,
  background,
  color,
}: {
  size: number
  text: string | number
  fontSize: number
  background: string
  color: string
}) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={background} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily='"Rajdhani", sans-serif'
        fontSize={fontSize}
        fontWeight={700}
        fill={color}
      >
        {text}
      </text>
    </svg>
  )
}
