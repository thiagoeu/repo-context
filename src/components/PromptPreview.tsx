"use client";

import { useState } from "react";
import { treeToText } from "../utils/treeToText";
import { FileNode } from "../types/fileNode";

interface PromptPreviewProps {
  selectedFolder: FileNode | null;
  fileContent: string | null; // Adicione esta linha
}

export default function PromptPreview({
  selectedFolder,
  fileContent,
}: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  // Lógica de prioridade:
  // 1. Se clicou num arquivo, mostra o conteúdo dele.
  // 2. Se não, mostra a árvore da pasta selecionada.
  const displayContent =
    fileContent || (selectedFolder ? treeToText([selectedFolder]) : "");

  async function handleCopy() {
    if (!displayContent) return;
    await navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm text-zinc-400">Prompt Preview</h2>
        <button
          onClick={handleCopy}
          disabled={!displayContent}
          className={`rounded px-3 py-1 text-xs transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {copied ? "Copied ✅" : "Copy"}
        </button>
      </div>

      <pre className="flex-1 overflow-auto rounded-xl border border-zinc-800 bg-black p-4 font-mono text-[13px] whitespace-pre-wrap text-zinc-300">
        {displayContent || "Nenhuma pasta ou arquivo selecionado"}
      </pre>
    </div>
  );
}
