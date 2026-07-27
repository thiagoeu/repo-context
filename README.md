# RepoContext

> Ferramenta inteligente para preparação e otimização de contexto de repositórios para modelos de linguagem (LLMs)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.0-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 Visão Geral

O **RepoContext** é uma ferramenta voltada para desenvolvedores que desejam preparar, organizar e otimizar o contexto de repositórios para utilização com modelos de linguagem (LLMs), como ChatGPT, Claude, Gemini e ferramentas de IA para desenvolvimento de software.

A aplicação permite abrir um repositório local, visualizar sua estrutura de arquivos, selecionar partes relevantes do projeto e gerar automaticamente um prompt estruturado e otimizado para IA. Além disso, conta com **análise de grafos de dependência**, **documentação automatizada via Ollama** e **consulta inteligente via RAG**.

---

## 🔍 Problema Resolvido

Trabalhar com IA em projetos de software apresenta diversos desafios:

- ❌ Dificuldade em enviar grandes quantidades de código para LLMs
- ❌ Copiar arquivos manualmente é lento e improdutivo
- ❌ Excesso de contexto irrelevante prejudica as respostas da IA
- ❌ Limite de tokens dos modelos
- ❌ Falta de organização ao compartilhar partes específicas do projeto
- ❌ Dificuldade em entender dependências entre arquivos

**RepoContext resolve tudo isso!** 🚀

---

## ✨ Funcionalidades

### 🗂️ Gerenciamento de Arquivos

- **Scan inteligente** de diretórios locais
- **Árvore de arquivos** interativa e navegável
- **Ignora automaticamente** pastas desnecessárias (`node_modules`, `.git`, `.next`, etc.)
- **Seleção granular** de arquivos individuais ou pastas inteiras

### 📝 Geração de Prompts

- **Dois modos de visualização:**
  - **Normal**: Exibe o conteúdo completo dos arquivos
  - **Otimizado**: Remove comentários e espaços para economizar tokens
- **Estimativa de tokens** em tempo real
- **Cálculo de economia** ao usar o modo otimizado
- **Cópia para clipboard** com fallback para ambientes sem HTTPS

### 🤖 Documentação com IA (Ollama)

- **Geração automática** de documentação técnica em Markdown
- **Integração com Ollama** para processamento local
- **Suporte a ferramentas** para leitura de arquivos
- **Documentação detalhada** com propósito, funções e exemplos

### 🔗 Code Graph (Grafo de Dependências)

- **Análise estática** de código-fonte para extrair funções, classes, componentes e hooks
- **Mapa de dependências** entre arquivos via detecção de imports
- **Visualização interativa** do grafo (nós e arestas)
- **Detecção automática** de chamadas de função entre módulos
- Página dedicada em `/graph`

### 🧠 RAG (Retrieval-Augmented Generation)

- **Chunking inteligente** de arquivos de código para indexação
- **Geração de embeddings** locais para busca semântica
- **Similaridade por cosseno** para encontrar contextos relevantes
- **Vector store** para consultas rápidas
- **Chat interativo** com IA sobre o código do repositório
- **API dedicada** para consultas RAG

### 🎨 Interface

- **Design moderno** com tema escuro
- **Responsivo** para diferentes tamanhos de tela
- **Feedback visual** para ações do usuário
- **Atalhos de teclado** para navegação rápida

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18.17.0 ou superior
- **npm** ou **yarn** ou **pnpm**
- **(Opcional) Ollama** para documentação com IA

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/repo-context.git
cd repo-context

# Instale as dependências
npm install

# Ou com yarn
yarn install

# Ou com pnpm
pnpm install
```

### Configuração

O projeto já vem com configurações otimizadas:

1. **Next.js** configurado para aceitar conexões de qualquer IP da rede local:

   ```javascript
   // next.config.ts - Detecta automaticamente todos os IPs
   allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0", ...getAllIPs()];
   ```

2. **TailwindCSS** configurado com tema escuro personalizado

3. **ESLint** e **Prettier** para código consistente

### Executando

```bash
# Modo desenvolvimento
npm run dev

# Modo desenvolvimento com host específico
npm run dev -- -H 0.0.0.0

# Build para produção
npm run build

# Executar em produção
npm start
```

Acesse: `http://localhost:3000`

### Páginas

| Rota     | Descrição                                         |
| -------- | ------------------------------------------------- |
| `/`      | Página principal (file explorer + prompt preview) |
| `/graph` | Visualização do grafo de dependências             |

### Documentação com IA (Ollama)

Para usar a funcionalidade de documentação automática:

1. **Instale o Ollama**: https://ollama.ai
2. **Baixe o modelo**:
   ```bash
   ollama pull llama3.2
   ```
3. **Inicie o servidor Ollama**:

   ```bash
   ollama serve
   ```

4. Execute o agente de documentação:
   ```bash
   npm run dev:doc-agent
   ```

---

## 🏗️ Estrutura do Projeto

```
repo-context/
├── src/
│   ├── agents/                          # Agentes de IA
│   │   ├── documentation/               # Agente de documentação
│   │   │   ├── index.ts                 # Ponto de entrada do agente
│   │   │   ├── prompt.ts                # Sistema de prompt
│   │   │   └── tools.ts                 # Ferramentas do agente
│   │   ├── graph/                       # Agente de grafo de dependências
│   │   │   ├── prompt.ts                # Prompt para análise de grafo
│   │   │   └── tools.ts                 # Extração de nós e arestas (AST simplificado)
│   │   └── shared/                      # Código compartilhado entre agentes
│   │       ├── providers/
│   │       │   └── ollama.ts            # Provider Ollama
│   │       └── types/                   # Tipos compartilhados
│   │           ├── askModelOptions.ts
│   │           ├── askModelParams.ts
│   │           └── message.ts
│   ├── app/                             # Rotas Next.js (App Router)
│   │   ├── api/                         # Rotas de API
│   │   │   ├── document/                # POST /api/document - Geração de documentação
│   │   │   ├── file/                    # POST /api/file - Leitura de arquivos
│   │   │   ├── graph/                   # POST /api/graph - Análise de grafo
│   │   │   ├── rag/                     # POST /api/rag - Consulta RAG
│   │   │   ├── test-embedding/          # POST /api/test-embedding - Teste de embeddings
│   │   │   └── tree/                    # POST /api/tree - Escaneamento de diretórios
│   │   ├── graph/                       # Página /graph
│   │   │   └── page.tsx                 # Visualização do grafo de dependências
│   │   ├── globals.css                  # Estilos globais
│   │   ├── layout.tsx                   # Layout principal
│   │   └── page.tsx                     # Página inicial
│   ├── features/                        # Features organizadas por domínio
│   │   ├── code-graph/                  # Feature: Code Graph
│   │   │   ├── index.ts                 # Re-exports
│   │   │   ├── components/
│   │   │   │   ├── GraphPanel.tsx       # Painel do grafo
│   │   │   │   └── GraphView.tsx        # Visualização do grafo
│   │   │   └── hooks/
│   │   │       └── useCodeGraph.ts      # Hook do grafo
│   │   ├── documentation/              # Feature: Documentação
│   │   │   ├── index.ts                 # Re-exports
│   │   │   ├── components/
│   │   │   │   └── DocumentationPanel.tsx # Painel de documentação
│   │   │   └── hooks/
│   │   │       └── useDocumentation.ts  # Hook de documentação
│   │   ├── file-explorer/              # Feature: Explorador de Arquivos
│   │   │   ├── index.ts                 # Re-exports
│   │   │   ├── components/
│   │   │   │   ├── FileExplorer.tsx     # Explorador de arquivos
│   │   │   │   ├── FileTree.tsx         # Árvore de arquivos interativa
│   │   │   │   ├── FolderTabs.tsx       # Tabs de pastas
│   │   │   │   └── SearchBar.tsx        # Barra de pesquisa
│   │   │   └── hooks/
│   │   │       └── useFileExplorer.ts   # Hook do explorador
│   │   ├── prompt-preview/             # Feature: Preview do Prompt
│   │   │   ├── components/
│   │   │   │   ├── CopyButton.tsx       # Botão de cópia com feedback
│   │   │   │   ├── PromptContent.tsx    # Conteúdo do prompt
│   │   │   │   ├── PromptFooter.tsx     # Rodapé com estatísticas
│   │   │   │   ├── PromptModeToggle.tsx # Toggle entre modos normal/otimizado
│   │   │   │   ├── PromptPreview.tsx    # Preview do prompt
│   │   │   │   ├── PromptStats.tsx      # Estatísticas do prompt
│   │   │   │   ├── SavingsStats.tsx     # Estatísticas de economia
│   │   │   │   └── index.ts            # Re-exports
│   │   │   └── hooks/
│   │   │       └── usePromptPreview.ts  # Hook do preview
│   │   └── rag/                        # Feature: RAG
│   │       ├── index.ts                 # Re-exports
│   │       ├── components/
│   │       │   └── ChatWidget.tsx       # Chat interativo com IA
│   │       └── hooks/
│   │           └── useRagChat.ts        # Hook do chat RAG
│   ├── services/                        # Serviços
│   │   ├── filesystem.ts               # Serviço de sistema de arquivos
│   │   └── rag/                        # Serviços RAG
│   │       ├── chunking.ts             # Chunking de código
│   │       ├── embeddings.ts           # Geração de embeddings
│   │       ├── similarity.ts           # Cálculo de similaridade (cosseno)
│   │       └── vectorStore.ts          # Armazenamento de vetores
│   ├── types/                           # Tipos TypeScript
│   │   └── fileNode.ts                 # Tipos de nós de arquivo + pastas ignoradas
│   └── utils/                           # Utilitários
│       ├── buildTree.ts                # Construção de árvore de diretórios
│       ├── calculateSavings.ts         # Cálculo de economia de tokens
│       ├── generatePrompt.ts           # Gerador de prompts
│       ├── generateStats.ts            # Gerador de estatísticas
│       ├── index.ts                    # Re-exports
│       ├── processFiles.ts             # Processador de arquivos
│       └── treeToText.ts               # Conversor de árvore para texto
├── .gitignore
├── eslint.config.mjs                   # Configuração ESLint
├── next.config.ts                      # Configuração Next.js
├── package.json
├── postcss.config.mjs                  # Configuração PostCSS
├── prettier.config.mjs                 # Configuração Prettier
├── readme.md                           # Este arquivo
└── tsconfig.json                       # Configuração TypeScript
```

---

## 🔧 Configuração Avançada

### Personalizando Pastas Ignoradas

Edite `src/types/fileNode.ts`:

```typescript
export const ignoredFolders = [
  "assets",
  "__pycache__",
  ".venv",
  "node_modules",
  // Adicione suas pastas aqui
];
```

### Alterando o Modelo Ollama

Em `src/agents/shared/providers/ollama.ts`:

```typescript
const { model = "llama3.2" } = options; // Troque para seu modelo preferido
```

### Configurando Porta

```bash
# Em desenvolvimento
npm run dev -- -p 3001

# Em produção
npm start -- -p 3001
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19.2.4** - Biblioteca UI
- **Next.js 16.2.6** - Framework React
- **TailwindCSS 4.3.0** - Framework CSS
- **Lucide React** - Ícones

### Core

- **TypeScript 5.0** - Superset JavaScript
- **Node.js** - Runtime

### Documentação & IA

- **Ollama** - Modelos de linguagem locais
- **React Markdown** - Renderização de Markdown
- **Remark GFM** - Suporte a GitHub Flavored Markdown

### Análise de Código

- **Regex-based AST** - Extração de funções, classes, componentes e hooks
- **Code Graph** - Mapeamento de dependências entre arquivos
- **RAG** - Embeddings locais + similaridade por cosseno

---

## 📦 Scripts Disponíveis

| Comando                 | Descrição                          |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Inicia servidor de desenvolvimento |
| `npm run build`         | Cria build de produção             |
| `npm start`             | Inicia servidor de produção        |
| `npm run lint`          | Executa ESLint                     |
| `npm run dev:doc-agent` | Inicia agente de documentação      |

---

## 🧪 Roadmap

### Fase 1 (Concluída) ✅

- [x] Filesystem scanner
- [x] File tree interativa
- [x] Seleção de arquivos
- [x] Geração de prompt

### Fase 2 (Concluída) ✅

- [x] Preview do prompt
- [x] Cópia para clipboard
- [x] Estatísticas de tokens
- [x] Modo otimizado (remoção de comentários)

### Fase 3 (Concluída) ✅

- [x] Parser de código (AST simplificado via regex)
- [x] Dependency graph (Code Graph)
- [x] Agente de documentação com Ollama
- [x] Página `/graph` para visualização

### Fase 4 (Em andamento) 🚧

- [x] RAG (Retrieval-Augmented Generation)
- [x] Embeddings locais
- [x] Chat interativo com IA sobre o código
- [ ] Contexto inteligente
- [ ] Agentes de IA autônomos
- [ ] Análise automática de arquitetura
- [ ] Plugin para VSCode
- [ ] Aplicação desktop (Tauri)

---

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie sua branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

---

## 🐛 Reportando Problemas

Abra uma issue com:

1. **Descrição** clara do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs **atual**
4. **Screenshots** se aplicável
5. **Versão** do Node.js e do projeto

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autor

- **Thiago Barbosa** - _Desenvolvimento Inicial_ - [@thiagoeu](https://github.com/thiagoeu)

---

## 📞 Contato

- **Email**: araujo.thiago1051@gmail.com
- **LinkedIn**: [Thiago Araújo](https://linkedin.com/in/seu-usuario)

---
