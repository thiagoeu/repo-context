"use client";

import { useState } from "react";
import { treeToText, cleanCode } from "../utils/treeToText";
import { FileNode } from "../types/fileNode";

interface PromptPreviewProps {
  selectedFolder: FileNode | null;
  fileContent: string | null;
  selectedFilePath: string | null;
}

export default function PromptPreview({
  selectedFolder,
  fileContent,
  selectedFilePath,
}: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "optimized">("preview");

  const getFinalContent = () => {
    if (fileContent) {
      if (viewMode === "optimized") {
        const cleaned = cleanCode(fileContent);
        return `<file path="${selectedFilePath || "unknown"}">\n${cleaned}\n</file>`;
      }
      return fileContent;
    }
    return selectedFolder ? treeToText([selectedFolder]) : "";
  };

  const displayContent = getFinalContent();

  async function handleCopy() {
    const textToCopy = getFinalContent();

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log("Copiado! Modo:", viewMode, "Tamanho:", textToCopy.length);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-zinc-400">Prompt Preview</h2>

          <div className="flex rounded-lg bg-zinc-900 p-1">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                viewMode === "preview"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setViewMode("optimized")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                viewMode === "optimized"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Otimizado (LLM)
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`rounded px-3 py-1 text-xs font-bold transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          }`}
        >
          {copied ? "COPIADO! ✅" : "COPIAR"}
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-black">
        {viewMode === "optimized" && fileContent && (
          <div className="pointer-events-none absolute top-2 right-4 text-[10px] font-bold tracking-widest text-blue-500 uppercase select-none">
            Modo Econômico Ativo
          </div>
        )}
        <pre className="h-full scrollbar-thin scrollbar-thumb-zinc-700 overflow-auto p-4 font-mono text-[13px] whitespace-pre-wrap text-zinc-300">
          {displayContent || "Nenhum conteúdo disponível"}
        </pre>
      </div>
    </div>
  );
}
