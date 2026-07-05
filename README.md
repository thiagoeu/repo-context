# 📚 Documentação do RepoContext

Vou criar uma documentação completa e profissional para seu projeto, incluindo instruções de instalação, uso e contribuição.

## 📄 README.md Completo

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

A aplicação permite abrir um repositório local, visualizar sua estrutura de arquivos, selecionar partes relevantes do projeto e gerar automaticamente um prompt estruturado e otimizado para IA.

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
│   ├── app/
│   │   ├── api/
│   │   │   ├── document/          # API para documentação com IA
│   │   │   ├── file/              # API para leitura de arquivos
│   │   │   └── tree/              # API para escaneamento de diretórios
│   │   ├── globals.css            # Estilos globais
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página inicial
│   ├── components/
│   │   ├── CopyButton.tsx         # Botão de cópia com feedback
│   │   ├── DocumentationPanel.tsx # Painel de documentação gerada
│   │   ├── FileExplorer.tsx       # Explorador de arquivos
│   │   ├── FileTree.tsx           # Árvore de arquivos interativa
│   │   ├── FolderTabs.tsx         # Tabs de pastas
│   │   ├── PromptContent.tsx      # Conteúdo do prompt
│   │   ├── PromptFooter.tsx       # Rodapé com estatísticas
│   │   ├── PromptModeToggle.tsx   # Toggle entre modos
│   │   ├── PromptPreview.tsx      # Preview do prompt
│   │   ├── PromptStats.tsx        # Estatísticas do prompt
│   │   ├── SavingsStats.tsx       # Estatísticas de economia
│   │   └── SearchBar.tsx          # Barra de pesquisa
│   ├── doc-agent/                 # Agente de documentação
│   │   ├── index.ts               # Ponto de entrada do agente
│   │   ├── prompt.ts              # Sistema de prompt
│   │   ├── tools.ts               # Ferramentas do agente
│   │   └── shared/                # Código compartilhado
│   ├── hooks/
│   │   ├── useDocumentation.ts    # Hook para documentação
│   │   └── usePromptPreview.ts    # Hook para preview do prompt
│   ├── types/
│   │   └── fileNode.ts            # Tipos de arquivos
│   └── utils/
│       ├── calculateSavings.ts    # Cálculo de economia
│       ├── generatePrompt.ts      # Gerador de prompts
│       ├── generateStats.ts       # Gerador de estatísticas
│       ├── processFiles.ts        # Processador de arquivos
│       └── treeToText.ts          # Conversor de árvore para texto
├── .gitignore
├── eslint.config.mjs              # Configuração ESLint
├── next.config.ts                 # Configuração Next.js
├── package.json
├── postcss.config.mjs             # Configuração PostCSS
├── prettier.config.mjs            # Configuração Prettier
├── readme.md                      # Este arquivo
└── tsconfig.json                  # Configuração TypeScript
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

Em `src/doc-agent/shared/providers/ollama.ts`:

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

### Documentação

- **Ollama** - Modelos de linguagem locais
- **React Markdown** - Renderização de Markdown
- **Remark GFM** - Suporte a GitHub Flavored Markdown

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

### Fase 3 (Em andamento) 🚧

- [ ] Parser de código (AST)
- [ ] Dependency graph
- [ ] Contexto inteligente

### Fase 4 (Futuro) 🔮

- [ ] Agentes de IA autônomos
- [ ] Análise automática de arquitetura
- [ ] Geração de documentação automática
- [ ] Plugin para VSCode
- [ ] Aplicação desktop (Tauri)

---

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie sua branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Guia de Estilo

- Use **TypeScript** para todo código novo
- Siga o **eslint** configurado
- Use **Prettier** para formatação
- Escreva **comentários** em português ou inglês
- Mantenha o **design** consistente

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

## 👥 Autores

- **Thiago Barbosa** - _Desenvolvimento Inicial_ - [@thiagoeu](https://github.com/thiagoeu)

---

---

## 📞 Contato

- **Email**: araujo.thiago1051@gmail.com
- **LinkedIn**: [Thiago Araújo](https://linkedin.com/in/seu-usuario)

---
