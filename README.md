# RepoContext

## Visão Geral

O RepoContext é uma ferramenta voltada para desenvolvedores que desejam preparar, organizar e otimizar o contexto de repositórios para utilização com modelos de linguagem (LLMs), como ChatGPT, Claude, Gemini e ferramentas de IA para desenvolvimento de software.

A aplicação permite abrir um repositório local ou remoto, visualizar sua estrutura de arquivos, selecionar partes relevantes do projeto e gerar automaticamente um prompt estruturado e otimizado para IA.

---

# Problema

Atualmente, trabalhar com IA em projetos de software apresenta diversos problemas relacionados ao contexto.

Os principais problemas são:

- dificuldade em enviar grandes quantidades de código para uma LLM
- copiar arquivos manualmente é lento e improdutivo
- excesso de contexto irrelevante prejudica as respostas da IA
- limite de tokens dos modelos
- falta de organização ao compartilhar partes específicas do projeto
- dificuldade em entender dependências entre arquivos
- ausência de ferramentas focadas em "context engineering"

Ferramentas atuais normalmente:

- focam apenas em repositórios públicos
- não possuem seleção visual eficiente
- não ajudam na organização do contexto
- não oferecem controle granular sobre os arquivos utilizados

---

# Objetivo

O objetivo do RepoContext é criar uma plataforma capaz de:

- ler repositórios locais ou remotos
- visualizar a árvore de arquivos
- permitir seleção granular de arquivos e pastas
- gerar prompts estruturados para LLMs
- estimar uso de tokens
- otimizar contexto para IA
- futuramente permitir agentes inteligentes navegando no código

---

# Motivação

Com o crescimento do uso de IA no desenvolvimento de software, o gerenciamento de contexto tornou-se um dos principais gargalos da produtividade.

Modelos de linguagem possuem janelas de contexto limitadas e dependem fortemente da qualidade das informações fornecidas.

O projeto surge como uma tentativa de resolver o problema de:

- preparação de contexto
- organização de informações
- navegação inteligente em repositórios
- integração entre código e IA

Além disso, o projeto possui forte caráter educacional e arquitetural, explorando:

- filesystem
- parsing de código
- tokenização
- engenharia de contexto
- ferramentas para desenvolvedores
- arquitetura modular
- sistemas baseados em agentes

---

# Arquitetura Inicial

O projeto será dividido em duas partes principais:

```txt
Frontend (UI)
↓
Core Engine
↓
Filesystem
```

---

# Estrutura do Projeto

```txt
repo-context/
├── apps/
│   └── web/
│
├── packages/
│   ├── core/
│   ├── filesystem/
│   ├── prompt-builder/
│   ├── tokenizer/
│   ├── parser/
│   └── shared/
│
├── package.json
└── pnpm-workspace.yaml
```

---

# Tecnologias

## Frontend

- React
- Next.js
- TailwindCSS
- Zustand

---

## Core

- TypeScript

---

## Futuro

- Tauri
- Ollama
- Agentes de IA
- AST parsing
- Dependency graph

---

# Estrutura dos Pacotes

## packages/core

Responsável pela orquestração principal do sistema.

Funções:

- scanRepository()
- buildPrompt()
- countTokens()

---

## packages/filesystem

Responsável por:

- leitura de diretórios
- leitura de arquivos
- ignore engine
- montagem da árvore

---

## packages/prompt-builder

Responsável por:

- concatenação de arquivos
- formatação para LLM
- templates de prompt

---

## packages/tokenizer

Responsável por:

- estimativa de tokens
- cálculo de contexto
- warnings de limite

---

## packages/parser

Responsável futuramente por:

- parsing TypeScript
- análise de imports
- dependency graph
- contexto inteligente

---

# Fluxo Inicial do Sistema

## 1. Usuário seleciona um repositório

Exemplo:

- pasta local
- URL do GitHub

---

## 2. Sistema lê a estrutura

A aplicação:

- escaneia diretórios
- ignora arquivos irrelevantes
- monta árvore de arquivos

---

## 3. Interface renderiza a árvore

Exemplo:

```txt
src/
 ├── auth/
 ├── users/
 └── main.ts
```

---

## 4. Usuário seleciona arquivos

Exemplo:

```txt
☑ auth.service.ts
☑ jwt.strategy.ts
☐ node_modules
```

---

## 5. Sistema gera contexto

Saída esperada:

````txt
# FILE: src/auth/auth.service.ts

```ts
export class AuthService {}
````

```

---

# MVP Inicial

A primeira versão terá apenas:

- seleção de pasta
- leitura da árvore
- checkbox para arquivos
- geração de prompt
- preview do prompt
- cópia para clipboard

Sem:
- IA
- agentes
- banco de dados
- autenticação
- cloud sync

---

# Roadmap

## Fase 1
- filesystem scanner
- file tree
- seleção de arquivos

---

## Fase 2
- prompt builder
- preview
- copy prompt

---

## Fase 3
- tokenizer
- cálculo de contexto

---

## Fase 4
- parsing
- dependency graph
- contexto inteligente

---

## Fase 5
- agentes de IA
- navegação automática no repositório
- geração inteligente de contexto

---

# Diferenciais

O principal diferencial do projeto será o foco em:

- context engineering
- repository intelligence
- developer tooling
- integração prática com LLMs
- organização eficiente de contexto

O projeto não busca ser apenas mais um chat com IA, mas sim uma ferramenta especializada para preparação e gerenciamento de contexto em projetos de software.

---

# Visão Futura

No futuro, o RepoContext poderá evoluir para:

- aplicação desktop
- plugin para VSCode
- integração com GitHub
- agentes autônomos
- análise automática de arquitetura
- geração de documentação
- code review assistido por IA
- debugging contextual
- geração inteligente de testes

---
```
