# TimeFacil - Guideline Visual e UX

## Direcao da marca
- Linguagem principal: street/futsal com visual de quadra colorida.
- Estrutura visual: alta energia nos acentos, legibilidade alta no conteudo.
- Regra: vibracao visual no topo e destaques, neutralidade controlada nas areas de leitura.
- Experiencia principal: mobile-first com estrutura de aplicativo.

## Tokens e paleta
- Superficies de leitura: `background`, `card`, `secondary`, `muted`.
- Cor de comando: `primary` (acoes principais e elementos de controle).
- Cor de energia de jogo: `accent` (destaques, celebracao, CTA secundario).
- Cor de risco: `destructive`.
- Contexto de fundo esportivo: classe `street-surface`.
- Evitar hardcode de cor para estrutura principal da tela.

## Tipografia e hierarquia
- Titulo principal de secao: `text-2xl` a `text-3xl` com alto contraste.
- Titulos de secao: `text-xl font-semibold`.
- Texto de apoio: `text-muted-foreground`.
- Manter consistencia de pesos e espacamento entre secoes.

## Componentes base
- Usar variants de `Button` (`default`, `outline`, `ghost`, `destructive`) sem recriar botao manual.
- Blocos de formulario/lista devem usar o padrao `SectionCard`.
- Campos de formulario devem manter labels claros e consistentes.
- Nível tecnico e opcional: mostrar badges de nivel somente quando informado.

## Feedback e estados
- Notificacoes: padrao unico com `sonner` (`toast.success`, `toast.error`).
- Nao usar `alert()` nativo.
- Loading em botoes deve usar padrao com icone de spinner + texto da acao.
- Estados vazios devem mostrar orientacao curta sobre o proximo passo.
- Resultado de sorteio deve informar indicador de equilibrio entre times.
- A jornada deve ser guiada em 3 etapas: Jogadores, Sorteio e Escalacoes.

## Iconografia
- Icones Lucide para acoes e navegacao.
- Emojis podem permanecer para contexto esportivo das posicoes, sem substituir icones de acao.

## Balanceamento avancado
- Jogador pode ter `skillLevel` de 1 a 5, opcional.
- Sorteio deve considerar goleiro por time, distribuicao de posicoes e media de nivel.
- Exibir no resultado a forca estimada de cada time (media) e diferenca global.

## Navegacao e app shell
- Estrutura por secoes: Inicio, Jogadores, Sorteio e Escalacoes.
- Em mobile usar navegacao inferior fixa com toque facil.
- Exibir status global no topo (contagem de jogadores e times gerados).

## PWA
- Manifest configurado com nome, tema e icones de instalacao.
- Service worker com cache offline de shell e atualizacao controlada.
- Exibir aviso de nova versao disponivel quando houver update.

## Checklist rapido de revisao
- A tela usa tokens semanticos de cor?
- Botoes seguem variants do design system?
- Mensagens de erro/sucesso usam toast?
- Existe consistencia de titulos e espacamentos?
- A acao principal esta visualmente evidente?
- O equilibrio entre times esta visivel no resultado?
- O fluxo por secoes esta intuitivo no mobile?
- O app instala e abre em modo standalone?
