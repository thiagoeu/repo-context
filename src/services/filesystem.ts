import fs from "fs";
import path from "path";
import { FileNode, ignoredFolders } from "@/types/fileNode";

/**
 * Escaneia recursivamente um diretório e retorna uma árvore de FileNodes.
 * Ignora automaticamente pastas configuradas em `ignoredFolders`.
 */

export function scanDirectory(dirPath: string): FileNode[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const nodes: FileNode[] = [];

  for (const entry of entries) {
    if (ignoredFolders.includes(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: "folder",
        children: scanDirectory(fullPath),
      });
    } else {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: "file",
      });
    }
  }

  return nodes;
}

/**
 * Lê o conteúdo de um arquivo em UTF-8.
 * Retorna null se o arquivo não existir.
 */
export function readFileContent(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
