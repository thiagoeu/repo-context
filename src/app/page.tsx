"use client";

import { useMemo, useState } from "react";
import {
  FolderTabs,
  PromptPreview,
  SearchBar,
  FileExplorer,
} from "@/components";
import { FileNode } from "@/types/fileNode";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);

  // ESTADO DE MÚLTIPLOS ARQUIVOS
  const [selectedFiles, setSelectedFiles] = useState<FileNode[]>([]);

  // Memo para extrair apenas os paths para o FileTree
  const selectedPaths = useMemo(
    () => selectedFiles.map((f) => f.path),
    [selectedFiles],
  );

  async function handleScan(path: string) {
    if (!path.trim()) return alert("Digite um caminho");
    setLoading(true);
    try {
      const response = await fetch("/api/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dirPath: path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro");
      setTree(data);
      const firstFolder = data.find((node: FileNode) => node.type === "folder");
      setSelectedFolder(firstFolder || null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(node: FileNode) {
    if (node.type === "folder") return;

    // Se já estiver selecionado, removemos da lista
    if (selectedPaths.includes(node.path)) {
      setSelectedFiles((prev) => prev.filter((f) => f.path !== node.path));
      return;
    }

    // Se não estiver, buscamos o conteúdo e adicionamos à lista
    try {
      const response = await fetch("/api/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: node.path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const fileWithContent = { ...node, content: data.content };
      setSelectedFiles((prev) => [...prev, fileWithContent]);
    } catch (error: any) {
      console.error("Erro ao ler arquivo:", error);
      alert("Não foi possível ler o arquivo.");
    }
  }

  const rootFolders = useMemo(() => {
    return tree.filter((node) => node.type === "folder");
  }, [tree]);

  return (
    <main className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold">RepoContext</h1>
        <SearchBar onScan={handleScan} isLoading={loading} />

        <FolderTabs
          folders={rootFolders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />

        <div className="mt-6 grid h-[600px] grid-cols-1 gap-6 md:grid-cols-2">
          {/* FileExplorer agora precisa conhecer os paths selecionados */}
          <FileExplorer
            selectedFolder={selectedFolder}
            onFileSelect={handleFileSelect}
            selectedPaths={selectedPaths}
          />

          {/* PromptPreview agora recebe a lista completa de objetos selecionados */}
          <PromptPreview selectedFiles={selectedFiles} />
        </div>
      </div>
    </main>
  );
}
