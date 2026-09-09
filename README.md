# Ranking BT — Super 8 (Feminino)

Site público de acompanhamento do ranking de Beach Tennis (Super 8), somente leitura. Os dados vêm do Excel oficial — ninguém edita nada pelo site.

## Como funciona (atualização automática)

```
Você salva o Excel no OneDrive (fluxo normal, nada muda pra você)
        ↓ OneDrive sincroniza sozinho na nuvem
GitHub Actions roda a cada 5 minutos:
  1. baixa o Excel pelo link de compartilhamento (scripts/fetch-source.mjs)
  2. gera public/data/ranking.json (scripts/sync.mjs)
  3. se algo mudou, faz commit + push sozinho
        ↓
Vercel detecta o push e redeploya o site automaticamente
        ↓
site público atualizado, com atraso de até ~5 minutos
```

Não existe backend, login ou banco de dados — e nenhuma credencial da Microsoft é usada. O download funciona através de um link de compartilhamento "qualquer pessoa com o link pode visualizar" (somente leitura), que é público por natureza; o único segredo guardado é o próprio link, salvo como *secret* do repositório para não aparecer nos logs.

O `sync.mjs` lê a aba **RANKING GERAL** do Excel — que já contém as fórmulas e a pontuação oficial calculada — e gera um JSON estruturado que o site consome. As abas `Super ( E/D/C )` são usadas só para pegar a data real de cada semana/etapa. Nenhuma regra de pontuação é recriada: pontos por etapa, bônus de participação e o total são lidos diretamente dos valores já calculados no Excel. A única coisa calculada pelo script é a **ordenação** (posição) e o corte progressivo por etapa (para mostrar "posição anterior" e evolução) — usando a mesma matemática oficial, aplicada em cada etapa.

Isso significa que **novas etapas e novas jogadoras são detectadas automaticamente**, desde que sigam o mesmo padrão de colunas do Excel (cada categoria suporta até 8 etapas, que é o limite de colunas já desenhado na planilha).

### Configurar a automação (uma vez só)

1. **Gerar o link de compartilhamento no OneDrive:** clique com o botão direito no arquivo → Compartilhar → "Qualquer pessoa com o link" → permissão **Somente visualização** (nunca "pode editar"). Copie o link.
2. **No GitHub**, vá em Settings → Secrets and variables → Actions → New repository secret:
   - Nome: `ONEDRIVE_SHARE_URL`
   - Valor: o link copiado no passo 1
3. **Conectar o repositório à Vercel** (vercel.com → Add New Project → importar o repositório do GitHub → Deploy). A partir daí, todo `git push` no branch principal redeploya sozinho.
4. Pronto — o workflow `.github/workflows/sync.yml` já roda a cada 5 minutos automaticamente a partir do primeiro push.

Para testar sem esperar 5 minutos: na aba **Actions** do GitHub, abra "Sincronizar ranking" → **Run workflow**.

## Atualizar o ranking manualmente (sem esperar a automação)

1. Salve o Excel atualizado em `data/source/Super 8 - Fem.xlsx` (substitua o arquivo existente).
2. Rode:
   ```bash
   npm run sync
   ```
   Isso regenera `public/data/ranking.json`. O terminal mostra um resumo (quantas jogadoras e etapas foram encontradas em cada categoria) — confira se bate com o esperado.
3. Rode `npm run build` e publique a pasta `dist/`, ou apenas dê `git push` (a Vercel redeploya sozinha).

Também dá para rodar apontando direto para outro caminho do arquivo:
```bash
node scripts/sync.mjs "C:\caminho\para\Super 8 - Fem.xlsx"
```

## Rodar localmente

```bash
npm install
npm run sync   # gera public/data/ranking.json a partir do Excel em data/source/
npm run dev    # abre o site em http://localhost:5173
```

Outros comandos:
- `npm run build` — gera o site de produção em `dist/`
- `npm run preview` — serve a build de produção localmente

## Stack

- **Frontend:** React + TypeScript + Vite, Tailwind CSS v4, Lucide (ícones), Recharts (gráfico de evolução), React Router.
- **Sincronização:** script Node (`scripts/sync.mjs`) usando `exceljs`, sem servidor — roda localmente e gera um JSON estático.
- **Hospedagem sugerida:** Vercel, Netlify ou GitHub Pages (build estático, sem custo, sem credenciais).

## Estrutura de dados

`public/data/ranking.json`:

```ts
{
  generatedAt: string        // quando a última sincronização rodou
  sourceFile: string
  categories: {
    E | D | C: {
      players: Player[]      // já ordenados por posição
      stages: Stage[]        // etapas com dado e/ou data agendada
      leaderId: string | null
      risingPlayerId: string | null   // maior evolução de posição na última etapa
    }
  }
}
```

Veja `src/types.ts` para os tipos completos (`Player`, `Stage`, etc.).

## Limitações conhecidas

- O layout da planilha comporta no máximo **8 etapas por categoria** (é o desenho atual do Excel). Para mais etapas, a própria planilha precisaria ganhar novas colunas.
- O "ranking daquela etapa" (histórico) ordena jogadoras empatadas em pontos pelo total de games como critério de desempate — a planilha original usa um confronto direto ("Simples") para desempate dentro do grupo de 8 da semana, que não é replicado aqui (afeta só a ordem entre jogadoras empatadas na mesma faixa de pontos dentro de uma única etapa, não a pontuação em si).
- A imagem de compartilhamento (Open Graph, `public/og-cover.svg`) está em SVG; para preview perfeito no WhatsApp/Instagram, o ideal é exportar uma versão `.png` (1200×630) a partir dela antes de divulgar o link.
- O GitHub Actions não garante rodar exatamente a cada 5 minutos — é o intervalo mínimo que ele aceita, mas pode atrasar em horários de pico da plataforma. Na prática, o ranking fica "quase em tempo real" (minutos de atraso), não instantâneo.
- Se o repositório ficar 60 dias sem nenhum commit, o GitHub desativa workflows agendados automaticamente (limitação deles, não nossa). Qualquer commit manual reativa.
