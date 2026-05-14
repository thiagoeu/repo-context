import { FileNode } from "../types/fileNode";

/**
 * VERSÃO NORMAL: Gera apenas a estrutura visual da árvore
 */
export function treeToText(nodes: FileNode[], prefix = ""): string {
  let result = "";
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? "┗ " : "┣ ";
    result += prefix + connector + node.name + "\n";

    if (node.children && node.children.length > 0) {
      const childPrefix = prefix + (isLast ? "  " : "┃ ");
      result += treeToText(node.children, childPrefix);
    }
  });
  return result;
}

/**
 * Limpa o código removendo comentários e linhas vazias
 */

export function cleanCode(code: string): string {
  if (!code) return "";
  return code
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "$1") // Remove comentários
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ");
}

export function generateOptimizedPrompt(nodes: FileNode[]): string {
  let result = "";

  function traverse(currentNodes: FileNode[]) {
    currentNodes.forEach((node) => {
      if (node.type === "file" && node.content) {
        const cleaned = cleanCode(node.content);
        result += `<file path="${node.path}">\n${cleaned}\n</file>\n`;
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  }

  traverse(nodes);
  return result;
}
