// Só tenta o menu nativo de compartilhar em telas de toque (celular), onde ele
// abre em tela cheia e é óbvio pro usuário. No desktop ele pode abrir sem foco
// visível e travar a Promise esperando uma interação que ninguém percebeu —
// por isso lá a gente sempre baixa o arquivo direto, sem passar por ele.
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

export async function exportNodeAsImage(node: HTMLElement, fileName: string) {
  const { default: html2canvas } = await import('html2canvas')
  if (document.fonts?.ready) await document.fonts.ready

  const canvas = await html2canvas(node, { backgroundColor: null, useCORS: true })
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao gerar imagem'))), 'image/png'),
  )

  const file = new File([blob], fileName, { type: 'image/png' })
  const canShareFile = isTouchDevice && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

  if (canShareFile) {
    try {
      await navigator.share({ files: [file], title: 'Ranking Super 8 - Inove' })
      return
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
