"use client";

import { Hash, Zap } from "lucide-react";

import { FileNode } from "@/types/fileNode";
import { usePromptPreview } from "@/hooks/usePromptPreview";

interface PromptPreviewProps {
  selectedFiles: FileNode[];
  selectedFolder: FileNode | null;
}

export default function PromptPreview({
  selectedFiles,
  selectedFolder,
}: PromptPreviewProps) {
  const {
    copied,
    viewMode,
    setViewMode,
    displayContent,
    stats,
    savings,
    handleCopy,
  } = usePromptPreview({
    selectedFiles,
    selectedFolder,
  });

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex min-h-[38px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
            Prompt Preview
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-[10px] font-medium text-zinc-400">
              <Hash size={10} className="text-zinc-500" />
              <span>{stats.chars} chars</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400">
              <Zap size={10} />
              <span>~{stats.tokens} tokens</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-zinc-900 p-1">
            <button
              type="button"
              onClick={() => setViewMode("optimized")}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                viewMode === "optimized"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Otimizado
            </button>

            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                viewMode === "preview"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Normal
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!displayContent}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              copied
                ? "bg-green-600 text-white"
                : "bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-50"
            }`}
          >
            {copied ? "COPIADO! ✅" : "COPIAR"}
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0a]">
        {viewMode === "optimized" && selectedFiles.length > 0 && (
          <div className="pointer-events-none absolute top-3 right-4 z-10 text-[9px] font-bold tracking-widest text-blue-500/80 uppercase select-none">
            LLM Optimized
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <pre className="h-full scrollbar-thin scrollbar-thumb-zinc-700 overflow-auto p-5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-400">
            {displayContent || (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600">
                <span className="text-xl">📄</span>

                <p className="text-sm italic">Nenhum arquivo selecionado</p>
              </div>
            )}
          </pre>
        </div>

        {savings && savings.percentage > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-800/50 bg-zinc-900/20 px-4 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <Zap size={12} className="fill-emerald-400" />
                {savings.percentage}% ECONOMIA
              </span>

              <span className="text-zinc-600">|</span>

              <span className="text-zinc-500 italic">
                ~{savings.diff.toLocaleString()} tokens poupados
              </span>
            </div>

            <span className="text-[9px] font-bold tracking-tighter text-zinc-600 uppercase">
              AI Context Ready
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
