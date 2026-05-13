"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import type { FileNode } from "@/types/fileNode";

interface IFileTreeProps {
  nodes: FileNode[];
}

const FileTreeNode = ({ node }: { node: FileNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren =
    node.type === "folder" && node.children && node.children.length > 0;

  const sortedChildren = [...(node.children || [])].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") {
      return -1;
    }

    if (a.type === "file" && b.type === "folder") {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });

  return (
    <div className="select-none">
      <div
        className="group flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 transition-colors duration-150 hover:bg-zinc-900"
        onClick={() => {
          if (node.type === "folder") {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex h-4 w-4 items-center justify-center text-zinc-500">
          {node.type === "folder" ? (
            isOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )
          ) : null}
        </div>

        <div>
          {node.type === "folder" ? (
            <Folder className="h-4 w-4 text-amber-400" />
          ) : (
            <File className="h-4 w-4 text-blue-400" />
          )}
        </div>

        <span className="font-mono text-[13px] text-zinc-300">{node.name}</span>
      </div>

      {isOpen && hasChildren && (
        <div className="ml-3 border-l border-zinc-800 pl-2">
          {sortedChildren.map((child, index) => (
            <FileTreeNode key={`${child.path}-${index}`} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({ nodes }: IFileTreeProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500 italic">
        Nenhum arquivo ou diretório encontrado.
      </div>
    );
  }

  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") {
      return -1;
    }

    if (a.type === "file" && b.type === "folder") {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-0.5 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      {sortedNodes.map((node, index) => (
        <FileTreeNode key={`${node.path}-${index}`} node={node} />
      ))}
    </div>
  );
}
