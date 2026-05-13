"use client";

import { useMemo, useState } from "react";
import FileTree from "@/components/FileTree";
import { treeToText } from "@/utils/treeToText";
import { FileNode } from "@/types/fileNode";
import PromptPreview from "./components/PromptPreview";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);

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

  const rootFolders = useMemo(() => {
    return tree.filter((node) => node.type === "folder");
  }, [tree]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold">RepoContext</h1>
        <SearchBar onScan={handleScan} isLoading={loading} />

        {rootFolders.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm text-zinc-400">Folders</h2>

            <div className="flex flex-wrap gap-2">
              {rootFolders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => setSelectedFolder(folder)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    selectedFolder?.path === folder.path
                      ? "border-zinc-100 bg-zinc-100 text-zinc-950"
                      : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                  } `}
                >
                  📁 {folder.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-2 text-sm text-zinc-400">Explorer</h2>

            <div className="h-[700px] overflow-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              {selectedFolder ? (
                <FileTree nodes={[selectedFolder]} />
              ) : (
                <div className="text-sm text-zinc-500">
                  Nenhuma pasta selecionada
                </div>
              )}
            </div>
          </div>

          <PromptPreview selectedFolder={selectedFolder} />
        </div>
      </div>
    </main>
  );
}
