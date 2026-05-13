"use client";

import { FileNode } from "@/types/fileNode";

interface FolderTabsProps {
  folders: FileNode[];
  selectedFolder: FileNode | null;
  onSelectFolder: (folder: FileNode) => void;
}

export default function FolderTabs({
  folders,
  selectedFolder,
  onSelectFolder,
}: FolderTabsProps) {
  if (folders.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-1 mt-6 h-full overflow-y-auto duration-300">
      <h2 className="mb-2 text-sm font-medium text-zinc-400">Folders</h2>

      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => {
          const isSelected = selectedFolder?.path === folder.path;

          return (
            <button
              key={folder.path}
              onClick={() => onSelectFolder(folder)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-200 ${
                isSelected
                  ? "border-zinc-100 bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <span className="mr-1.5">📁</span>
              {folder.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
