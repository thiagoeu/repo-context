"use client";

import FileTree from "@/components/FileTree";
import { FileNode } from "@/types/fileNode";

interface FileExplorerProps {
  selectedFolder: FileNode | null;
  onFileSelect: (node: FileNode) => void;
}

export default function FileExplorer({
  selectedFolder,
  onFileSelect,
}: FileExplorerProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <h2 className="text-sm font-medium tracking-wide text-zinc-400">
        Explorer
      </h2>

      <div className="flex-1 scrollbar-thin scrollbar-thumb-zinc-700 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        {selectedFolder ? (
          <FileTree nodes={[selectedFolder]} onNodeClick={onFileSelect} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500 italic">
            <span className="text-2xl">📂</span>
            <p className="text-sm">
              Selecione uma pasta para visualizar a árvore
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
