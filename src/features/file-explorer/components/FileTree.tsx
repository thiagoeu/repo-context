"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import type { FileNode } from "../../../types/fileNode";

interface IFileTreeProps {
  nodes: FileNode[];
  onNodeClick: (node: FileNode) => void;
  onFolderToggle: (node: FileNode, checked: boolean) => void; // NOVA
  selectedPaths: string[];
}

const FileTreeNode = ({
  node,
  onNodeClick,
  onFolderToggle,
  selectedPaths,
}: {
  node: FileNode;
  onNodeClick: (node: FileNode) => void;
  onFolderToggle: (node: FileNode, checked: boolean) => void;
  selectedPaths: string[];
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Verifica se o arquivo está selecionado
  const isSelected = selectedPaths.includes(node.path);

  // Verifica se todos os arquivos da pasta estão selecionados (para o checkbox da pasta)
  const isFolderFullySelected = useMemo(() => {
    if (node.type !== "folder") return false;
    const allFiles: string[] = [];
    const collectPaths = (n: FileNode) => {
      if (n.type === "file") allFiles.push(n.path);
      else if (n.children) n.children.forEach(collectPaths);
    };
    collectPaths(node);
    if (allFiles.length === 0) return false;
    return allFiles.every((p) => selectedPaths.includes(p));
  }, [node, selectedPaths]);

  const hasChildren =
    node.type === "folder" && node.children && node.children.length > 0;

  const sortedChildren = [...(node.children || [])].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  const handleFolderCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onFolderToggle(node, e.target.checked);
  };

  return (
    <div className="select-none">
      <div
        className="group flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 transition-colors duration-150 hover:bg-zinc-900"
        onClick={() => {
          if (node.type === "folder") {
            setIsOpen(!isOpen);
          } else {
            onNodeClick(node);
          }
        }}
      >
        {/* Ícone de expandir/recolher */}
        <div className="flex h-4 w-4 items-center justify-center text-zinc-500">
          {node.type === "folder" ? (
            isOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )
          ) : null}
        </div>

        {/* Checkbox para PASTAS */}
        {node.type === "folder" && (
          <input
            type="checkbox"
            checked={isFolderFullySelected}
            onChange={handleFolderCheck}
            onClick={(e) => e.stopPropagation()}
            className="mr-1 h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 accent-blue-500"
          />
        )}

        {/* Checkbox para ARQUIVOS */}
        {node.type === "file" && (
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            onClick={(e) => {
              e.stopPropagation();
              onNodeClick(node);
            }}
            className="mr-1 h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 accent-blue-500"
          />
        )}

        <div>
          {node.type === "folder" ? (
            <Folder className="h-4 w-4 text-amber-400" />
          ) : (
            <File className="h-4 w-4 text-blue-400" />
          )}
        </div>

        <span
          className={`font-mono text-[13px] ${isSelected ? "font-medium text-blue-400" : "text-zinc-300"}`}
        >
          {node.name}
        </span>
      </div>

      {isOpen && hasChildren && (
        <div className="ml-3 border-l border-zinc-800 pl-2">
          {sortedChildren.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onNodeClick={onNodeClick}
              onFolderToggle={onFolderToggle}
              selectedPaths={selectedPaths}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({
  nodes,
  onNodeClick,
  onFolderToggle,
  selectedPaths,
}: IFileTreeProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500 italic">
        Nenhum arquivo ou diretório encontrado.
      </div>
    );
  }

  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-0.5 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      {sortedNodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onNodeClick={onNodeClick}
          onFolderToggle={onFolderToggle}
          selectedPaths={selectedPaths}
        />
      ))}
    </div>
  );
}
