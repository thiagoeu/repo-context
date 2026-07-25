# RepoContext — Reestruturação + Feature: Grafo de Fluxo de Código

## Contexto

O RepoContext é uma ferramenta Next.js que permite escanear repositórios locais, selecionar arquivos e gerar prompts otimizados para LLMs. Já possui um agente de documentação integrado ao Ollama.

O usuário quer duas coisas:
1. **Avaliar a estrutura atual** e sugerir uma organização mais escalável e profissional
2. **Implementar a feature de Grafo de Fluxo** — visualizar como métodos/funções se relacionam ("quem chama quem") nos arquivos selecionados, usando o sistema de agentes já existente

---

## Avaliação da Estrutura Atual

### Problemas identificados

| Problema | Onde | Impacto |
|---|---|---|
| Lógica de fetch de arquivo duplicada em 3 lugares | `page.tsx` (handleFileSelect, handleFolderToggle, handleSelectAll) | Difícil manutenção |
| `scanDirectory` embutida no route handler | `api/tree/route.ts` | Não reutilizável, difícil de testar |
| `doc-agent/` dentro de `src/` misturado com frontend | `src/doc-agent/` | Confusão de camadas |
| Sem camada de `services/` | — | Toda lógica de negócio vive nos hooks e na page |
| `page.tsx` com 250 linhas e muita lógica de estado | `src/app/page.tsx` | God component |
| Sem separação de features | `components/` plana | Não escala para múltiplas features |
| Componentes não organizados por feature | `components/` | Mistura prompt, file, doc na mesma pasta |

### Estrutura atual
```
src/
├── app/
│   ├── api/document/ file/ tree/
│   ├── page.tsx (250 linhas, god component)
├── components/         ← FLAT, sem organização por feature
├── doc-agent/          ← Agente CLI misturado no src do Next.js
├── hooks/
├── types/
└── utils/
```

---

## Estrutura Proposta

```
src/
├── app/
│   ├── api/
│   │   ├── document/route.ts
│   │   ├── file/route.ts
│   │   ├── tree/route.ts
│   │   └── graph/route.ts          ← NOVA: API do grafo
│   ├── layout.tsx
│   └── page.tsx                    ← Orquestrador limpo (~50 linhas)
│
├── features/                       ← NOVA: organização por feature
│   ├── file-explorer/
│   │   ├── components/             ← FileExplorer, FileTree, FolderTabs, SearchBar
│   │   ├── hooks/
│   │   │   └── useFileExplorer.ts  ← extrai lógica do page.tsx
│   │   └── index.ts
│   │
│   ├── prompt-preview/
│   │   ├── components/             ← PromptPreview, PromptContent, PromptFooter, etc.
│   │   ├── hooks/
│   │   │   └── usePromptPreview.ts (já existe, move aqui)
│   │   └── index.ts
│   │
│   ├── documentation/
│   │   ├── components/             ← DocumentationPanel
│   │   ├── hooks/
│   │   │   └── useDocumentation.ts (já existe, move aqui)
│   │   └── index.ts
│   │
│   └── code-graph/                 ← NOVA FEATURE
│       ├── components/
│       │   ├── GraphView.tsx       ← Renderiza o grafo (SVG/canvas)
│       │   └── GraphControls.tsx   ← Filtros, zoom, select grafo
│       ├── hooks/
│       │   └── useCodeGraph.ts     ← Chama a API e gerencia estado
│       └── index.ts
│
├── agents/                         ← RENAME: doc-agent → agents (camada genérica)
│   ├── shared/
│   │   ├── providers/
│   │   │   └── ollama.ts
│   │   └── types/
│   ├── documentation/
│   │   ├── prompt.ts
│   │   └── tools.ts
│   └── graph/                      ← NOVO agente para grafo
│       ├── prompt.ts               ← System prompt para análise de grafo
│       └── tools.ts                ← Tools: lerArquivo, analisarAST
│
├── services/                       ← NOVA: lógica de negócio server-side
│   ├── filesystem.ts               ← scanDirectory (extrai de tree/route.ts)
│   └── fileReader.ts               ← lerArquivoLocal (extrai de tools.ts)
│
├── types/
│   └── fileNode.ts
│
└── utils/                          ← Pure functions, sem side effects
    ├── buildTree.ts
    ├── calculateSavings.ts
    ├── generatePrompt.ts
    ├── generateStats.ts
    ├── processFiles.ts
    └── treeToText.ts
```

---

## Feature: Grafo de Fluxo de Código

### Como vai funcionar

1. **Usuário seleciona arquivos** (já existe)
2. **Clica em "Analisar Grafo"** → nova aba/painel
3. **API `/api/graph`** recebe os caminhos dos arquivos e seus conteúdos
4. **Agente de grafo** usa o Ollama para:
   - Identificar funções/classes em cada arquivo
   - Detectar quem chama quem (call graph)
   - Retornar um JSON estruturado de nós e arestas
5. **Frontend renderiza** um grafo interativo com SVG nativo (sem lib pesada)

### Formato de resposta do agente (JSON)

```json
{
  "nodes": [
    { "id": "page.tsx::handleScan", "label": "handleScan", "file": "page.tsx" },
    { "id": "api/tree::scanDirectory", "label": "scanDirectory", "file": "api/tree/route.ts" }
  ],
  "edges": [
    { "from": "page.tsx::handleScan", "to": "api/tree::scanDirectory", "label": "fetch /api/tree" }
  ],
  "clusters": [
    { "id": "page.tsx", "nodes": ["page.tsx::handleScan", ...] }
  ]
}
```

### Múltiplos grafos possíveis
- **Grafo de chamadas**: quem chama quem
- **Grafo de imports**: dependências entre módulos
- (Futuro) Grafo de componentes React

### Renderização

Usaremos **SVG nativo** gerado no cliente — sem D3, sem React Flow. Leve, sem dependências novas:
- Nós como `<rect>` com texto
- Arestas como `<line>` ou `<path>` com setas
- Agrupamento por arquivo com `<g>` e cor diferente por cluster
- Zoom/pan com transform SVG
- Tooltip ao hover

---

## Proposta de Mudanças

### Fase 1 — Reestruturação (sem quebrar funcionalidade)

#### [MODIFY] Criar `src/features/file-explorer/`
- Mover `FileExplorer.tsx`, `FileTree.tsx`, `FolderTabs.tsx`, `SearchBar.tsx`
- Criar `useFileExplorer.ts` extraindo lógica do `page.tsx`

#### [MODIFY] Criar `src/features/prompt-preview/`
- Mover `PromptPreview.tsx`, `PromptContent.tsx`, `PromptFooter.tsx`, `PromptModeToggle.tsx`, `PromptStats.tsx`, `SavingsStats.tsx`
- Mover `hooks/usePromptPreview.ts`

#### [MODIFY] Criar `src/features/documentation/`
- Mover `DocumentationPanel.tsx`
- Mover `hooks/useDocumentation.ts`

#### [MODIFY] Renomear `doc-agent/` → `agents/`
- Criar `agents/shared/` (já existe como `doc-agent/shared/`)
- Criar `agents/documentation/` (prompt.ts + tools.ts)

#### [NEW] `src/services/filesystem.ts`
- Extrair `scanDirectory` de `api/tree/route.ts`

#### [NEW] `src/services/fileReader.ts`
- Extrair `lerArquivoLocal` de `agents/documentation/tools.ts`

#### [MODIFY] `src/app/page.tsx`
- Refatorar para usar `useFileExplorer` hook — limpar o god component

---

### Fase 2 — Feature: Code Graph

#### [NEW] `src/agents/graph/prompt.ts`
System prompt especializado para análise de grafo de chamadas

#### [NEW] `src/agents/graph/tools.ts`
Tool `analisarArquivos` que retorna JSON de nós/arestas

#### [NEW] `src/app/api/graph/route.ts`
Endpoint que orquestra o agente de grafo

#### [NEW] `src/features/code-graph/hooks/useCodeGraph.ts`
Hook que chama `/api/graph` e gerencia estado de loading/error/data

#### [NEW] `src/features/code-graph/components/GraphView.tsx`
Renderizador SVG do grafo (nós, arestas, clusters, zoom)

#### [NEW] `src/features/code-graph/components/GraphControls.tsx`
Painel de controles: tipo de grafo, zoom, filtros

#### [MODIFY] `src/app/page.tsx`
Adicionar nova aba "Graph" ao lado do prompt preview

---

## Verificação

### O que vou testar
- Build sem erros: `npm run build`
- Paths de import atualizados corretamente após refactor
- API `/api/graph` retorna JSON válido
- SVG renderiza com nós e arestas clicáveis

---

## Questões em aberto

> [!IMPORTANT]
> **Escopo da Fase 1 (reestruturação)**: Você quer que eu faça a reestruturação de pastas AGORA junto com o grafo, ou prefere que eu implemente o grafo **na estrutura atual** primeiro e depois refatoramos?

> [!IMPORTANT]
> **Modelo Ollama**: O agente de grafo vai usar o mesmo `llama3.2`. Modelos menores podem ter dificuldade em retornar JSON estruturado. Temos duas opções:
> - Usar Ollama com `format: "json"` para forçar saída JSON
> - Fazer parse estático de imports com regex/AST no servidor (sem IA para a parte de grafo, mais confiável)
> **Qual prefere?** (Recomendo híbrido: AST/regex para estrutura + IA para insights)

> [!NOTE]
> **Sem novas dependências pesadas**: SVG nativo é suficiente para o MVP. Se quiser algo mais sofisticado no futuro (layout automático tipo dagre), podemos adicionar depois.
