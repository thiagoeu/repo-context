"use client";

import { useMemo, useState } from "react";
import { cleanCode } from "../utils/treeToText";
import { FileNode } from "../types/fileNode";
import { Hash, Zap } from "lucide-react";

interface PromptPreviewProps {
  selectedFiles: FileNode[];
}

export default function PromptPreview({ selectedFiles }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "optimized">(
    "optimized",
  );

  const displayContent = useMemo(() => {
    if (selectedFiles.length === 0) return "";

    return selectedFiles
      .map((file) => {
        const content = file.content || "";
        if (viewMode === "optimized") {
          const cleaned = cleanCode(content);
          return `<file path="${file.path}">\n${cleaned}\n</file>`;
        }
        return `--- FILE: ${file.path} ---\n${content}\n`;
      })
      .join("\n\n");
  }, [selectedFiles, viewMode]);

  const stats = useMemo(() => {
    const totalChars = displayContent.length;
    // Estimativa de tokens (média de 4 caracteres por token)
    const totalTokens = Math.ceil(totalChars / 4);

    return {
      chars: totalChars.toLocaleString(),
      tokens: totalTokens.toLocaleString(),
      fileCount: selectedFiles.length,
    };
  }, [displayContent, selectedFiles.length]);

  const savings = useMemo(() => {
    if (selectedFiles.length === 0) return null;

    const normalChars = selectedFiles.reduce(
      (acc, file) => acc + (file.content?.length || 0) + 20, // 20 chars for header
      0,
    );

    const optimizedChars = selectedFiles.reduce((acc, file) => {
      const cleaned = cleanCode(file.content || "");
      return acc + cleaned.length + 30; // 30 chars for <file> tags
    }, 0);

    const diff = normalChars - optimizedChars;
    const percentage =
      normalChars > 0 ? Math.max(0, Math.round((diff / normalChars) * 100)) : 0;

    return { percentage, diff: Math.max(0, Math.ceil(diff / 4)) };
  }, [selectedFiles]);

  async function handleCopy() {
    if (!displayContent) return;

    try {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
            Prompt Preview
          </h2>

          {/* Badges de Status */}
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

        {/* Integrated Savings Footer */}
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
