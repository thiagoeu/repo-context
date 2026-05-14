'use client';

import FileTree from '@/components/FileTree';
import { FileNode } from '@/types/fileNode';

import { CheckSquare, Trash2 } from 'lucide-react';

interface FileExplorerProps {
  selectedFolder: FileNode | null;
  onFileSelect: (node: FileNode) => void;
  selectedPaths: string[];
  onSelectAll: () => void;
  onClearAll: () => void;
}

export default function FileExplorer({
  selectedFolder,
  onFileSelect,
  selectedPaths,
  onSelectAll,
  onClearAll,
}: FileExplorerProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-wide text-zinc-400">Explorer</h2>

        {selectedFolder && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSelectAll}
              title="Selecionar todos da pasta"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <CheckSquare size={12} />
              TUDO
            </button>
            <button
              type="button"
              onClick={onClearAll}
              disabled={selectedPaths.length === 0}
              title="Limpar seleção"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
            >
              <Trash2 size={12} />
              LIMPAR
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 scrollbar-thin scrollbar-thumb-zinc-700 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        {selectedFolder ? (
          <FileTree
            nodes={[selectedFolder]}
            onNodeClick={onFileSelect}
            selectedPaths={selectedPaths}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500 italic">
            <span className="text-2xl">📂</span>
            <p className="text-sm">Selecione uma pasta para visualizar a árvore</p>
          </div>
        )}
      </div>
    </div>
  );
}
