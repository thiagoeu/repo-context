"use client";

import { useMemo, useState } from "react";

import FileTree from "./components/FileTree";
import { treeToText } from "./utils/treeToText";
import type { FileNode } from "@/types/fileNode";

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
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">RepoContext</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="C:/projects/my-app"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="
              w-full
              bg-zinc-900
              border
              border-zinc-800
              rounded-lg
              px-4
              py-2
              outline-none
              focus:border-zinc-600
            "
          />

          <button
            onClick={handleScan}
            className="
              px-5
              py-2
              rounded-lg
              bg-zinc-100
              text-zinc-950
              font-medium
              hover:bg-white
              transition-colors
            "
          >
            Scan
          </button>
        </div>

        {rootFolders.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm text-zinc-400 mb-2">Folders</h2>

            <div className="flex flex-wrap gap-2">
              {rootFolders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => setSelectedFolder(folder)}
                  className={`
                    px-3
                    py-1.5
                    rounded-md
                    border
                    text-sm
                    transition-colors
                    ${
                      selectedFolder?.path === folder.path
                        ? "bg-zinc-100 text-zinc-950 border-zinc-100"
                        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    }
                  `}
                >
                  📁 {folder.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-sm text-zinc-400 mb-2">Explorer</h2>

            <div
              className="
                h-[700px]
                overflow-auto
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-4
              "
            >
              {selectedFolder ? (
                <FileTree nodes={[selectedFolder]} />
              ) : (
                <div className="text-zinc-500 text-sm">
                  Nenhuma pasta selecionada
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm text-zinc-400">Prompt Preview</h2>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    selectedFolder ? treeToText([selectedFolder]) : "",
                  );
                }}
                className="
                  text-xs
                  px-3
                  py-1
                  rounded
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition-colors
                "
              >
                Copy
              </button>
            </div>

            <pre
              className="
                h-[700px]
                overflow-auto
                rounded-xl
                border
                border-zinc-800
                bg-black
                p-4
                text-sm
                font-mono
                text-zinc-300
                whitespace-pre-wrap
              "
            >
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
