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
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

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
    if (node.type === "folder") {
      setFileContent(null);
      setSelectedFilePath(null);
      return;
    }

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: node.path }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setFileContent(data.content);
      setSelectedFilePath(node.path);
    } catch (error: any) {
      console.error("Erro ao ler arquivo:", error);
      alert("Não foi possível ler o arquivo.");
    }
  }

  const rootFolders = useMemo(() => {
    return tree.filter((node) => node.type === "folder");
  }, [tree]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold">RepoContext</h1>

        <SearchBar onScan={handleScan} isLoading={loading} />

        <FolderTabs
          folders={rootFolders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />

        <div className="mt-6 grid h-[calc(100vh-320px)] min-h-[500px] grid-cols-1 gap-6 md:grid-cols-2">
          <FileExplorer
            selectedFolder={selectedFolder}
            onFileSelect={handleFileSelect}
          />
          <PromptPreview
            selectedFolder={selectedFolder}
            fileContent={fileContent}
            selectedFilePath={selectedFilePath}
          />
        </div>
      </div>
    </main>
  );
}
