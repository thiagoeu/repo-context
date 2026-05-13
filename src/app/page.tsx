"use client";

import { useMemo, useState } from "react";
import FileTree from "@/components/FileTree";
import { treeToText } from "@/utils/treeToText";
import { FileNode } from "@/types/fileNode";

export default function Home() {
  const [path, setPath] = useState("");
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);

  async function handleScan() {
    if (!path.trim()) {
      alert("Digite um caminho");
      return;
    }

    try {
      const response = await fetch("/api/tree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dirPath: path,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro");
        return;
      }

      setTree(data);

      const firstFolder = data.find((node: FileNode) => node.type === "folder");

      setSelectedFolder(firstFolder || null);
    } catch (error) {
      console.error(error);
      alert("Erro ao escanear diretório");
    }
  }

  const rootFolders = useMemo(() => {
    return tree.filter((node) => node.type === "folder");
  }, [tree]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold">RepoContext</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="C:/projects/my-app"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 outline-none focus:border-zinc-600"
          />

          <button
            onClick={handleScan}
            className="rounded-lg bg-zinc-100 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-white"
          >
            Scan
          </button>
        </div>

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

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm text-zinc-400">Prompt Preview</h2>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    selectedFolder ? treeToText([selectedFolder]) : "",
                  );
                }}
                className="rounded bg-zinc-800 px-3 py-1 text-xs transition-colors hover:bg-zinc-700"
              >
                Copy
              </button>
            </div>

            <pre className="h-[700px] overflow-auto rounded-xl border border-zinc-800 bg-black p-4 font-mono text-sm whitespace-pre-wrap text-zinc-300">
              {selectedFolder
                ? treeToText([selectedFolder])
                : "Nenhuma pasta selecionada"}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
