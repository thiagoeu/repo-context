export interface GraphNode {
  id: string;
  label: string;
  file: string;
  type: "function" | "class" | "component" | "hook" | "method" | "export";
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface FileInput {
  path: string;
  content: string;
}

/**
 * Extrai estaticamente nós (funções, classes, exports) de um arquivo de código.
 * Usa regex para evitar dependência de AST parsers pesados.
 */
export function extractNodes(file: FileInput): GraphNode[] {
  const nodes: GraphNode[] = [];
  const fileName = file.path.split(/[\\/]/).pop() || file.path;
  const content = file.content;

  const patterns: Array<{
    regex: RegExp;
    type: GraphNode["type"];
  }> = [
    // React components (PascalCase functions)
    {
      regex:
        /(?:export\s+(?:default\s+)?function|function)\s+([A-Z][a-zA-Z0-9]*)\s*[(<]/g,
      type: "component",
    },
    // hooks (camelCase starting with "use")
    {
      regex: /(?:export\s+)?(?:function|const)\s+(use[A-Z][a-zA-Z0-9]*)/g,
      type: "hook",
    },
    // regular functions (camelCase)
    {
      regex:
        /(?:export\s+)?(?:async\s+)?function\s+([a-z][a-zA-Z0-9]*)\s*[(<]/g,
      type: "function",
    },
    // arrow functions exported
    {
      regex: /export\s+(?:const|let)\s+([a-zA-Z][a-zA-Z0-9]*)\s*=/g,
      type: "export",
    },
    // classes
    { regex: /(?:export\s+)?class\s+([A-Za-z][a-zA-Z0-9]*)/g, type: "class" },
  ];

  const seen = new Set<string>();

  for (const { regex, type } of patterns) {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(content)) !== null) {
      const name = match[1];
      if (!name || seen.has(name)) continue;
      seen.add(name);
      nodes.push({
        id: `${file.path}::${name}`,
        label: name,
        file: fileName,
        type,
      });
    }
  }

  return nodes;
}

/**
 * Detecta edges entre arquivos usando análise de imports e chamadas de função.
 */
export function extractEdges(
  files: FileInput[],
  allNodes: GraphNode[],
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const nodesByLabel = new Map<string, GraphNode[]>();

  for (const node of allNodes) {
    const existing = nodesByLabel.get(node.label) || [];
    existing.push(node);
    nodesByLabel.set(node.label, existing);
  }

  for (const file of files) {
    const sourceNodes = allNodes.filter((n) => n.id.startsWith(file.path));
    const content = file.content;

    // Extrair imports entre os arquivos analisados
    const importRegex =
      /import\s+(?:(?:\{[^}]+\}|\*\s+as\s+\w+|\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[0];
      // Extrair nomes importados
      const namesMatch = importPath.match(/\{([^}]+)\}/);
      const defaultMatch = importPath.match(/import\s+([a-zA-Z][a-zA-Z0-9]*)/);

      const importedNames: string[] = [];
      if (namesMatch) {
        importedNames.push(
          ...namesMatch[1].split(",").map((n) => n.trim().split(" as ")[0]),
        );
      }
      if (defaultMatch && !importPath.includes("{")) {
        importedNames.push(defaultMatch[1]);
      }

      for (const name of importedNames) {
        const targets = nodesByLabel.get(name) || [];
        for (const target of targets) {
          // Evitar self-edges
          if (target.id.startsWith(file.path)) continue;

          for (const sourceNode of sourceNodes) {
            const edgeId = `${sourceNode.id}->${target.id}`;
            if (!edges.find((e) => `${e.from}->${e.to}` === edgeId)) {
              edges.push({
                from: sourceNode.id,
                to: target.id,
                label: "importa",
              });
            }
          }
        }
      }
    }

    // Detectar chamadas de função dentro do arquivo
    for (const sourceNode of sourceNodes) {
      for (const targetNode of allNodes) {
        if (targetNode.id === sourceNode.id) continue;
        if (targetNode.id.startsWith(file.path)) continue;

        // Verificar se o label do target aparece no conteúdo
        const callRegex = new RegExp(
          `\\b${escapeRegex(targetNode.label)}\\s*[(<]`,
          "g",
        );
        if (callRegex.test(content)) {
          const edgeId = `${sourceNode.id}->${targetNode.id}`;
          if (!edges.find((e) => `${e.from}->${e.to}` === edgeId)) {
            edges.push({
              from: sourceNode.id,
              to: targetNode.id,
              label: "usa",
            });
          }
        }
      }
    }
  }

  return edges;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Ponto de entrada principal: analisa os arquivos e retorna o grafo completo.
 */
export function analyzeFiles(files: FileInput[]): GraphData {
  const allNodes = files.flatMap(extractNodes);
  const edges = extractEdges(files, allNodes);

  return { nodes: allNodes, edges };
}
