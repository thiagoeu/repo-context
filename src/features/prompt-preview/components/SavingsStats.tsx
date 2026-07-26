"use client";

import { useMemo } from "react";
import { FileNode } from "@/types/fileNode";
import { cleanCode } from "@/utils/treeToText";
import { TrendingDown, Zap } from "lucide-react";

interface SavingsStatsProps {
  selectedFiles: FileNode[];
}

export default function SavingsStats({ selectedFiles }: SavingsStatsProps) {
  const savings = useMemo(() => {
    if (selectedFiles.length === 0) return null;

    // Tamanho Normal
    const normalText = selectedFiles
      .map((file) => `--- FILE: ${file.path} ---\n${file.content || ""}\n`)
      .join("\n\n");
    const normalChars = normalText.length;

    // Tamanho Otimizado
    const optimizedText = selectedFiles
      .map((file) => {
        const cleaned = cleanCode(file.content || "");
        return `<file path="${file.path}">\n${cleaned}\n</file>`;
      })
      .join("\n\n");
    const optimizedChars = optimizedText.length;

    const savedChars = normalChars - optimizedChars;
    const percentage =
      normalChars > 0
        ? Math.max(0, Math.round((savedChars / normalChars) * 100))
        : 0;

    // Estimativa de tokens (1 token ~ 4 chars)
    const savedTokens = Math.ceil(savedChars / 4);

    return {
      percentage,
      savedTokens,
      isPositive: savedChars > 0,
    };
  }, [selectedFiles]);

  if (!savings || selectedFiles.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 mt-4 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-3 text-zinc-400 duration-400">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        <TrendingDown size={18} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100">
            {savings.percentage}% de economia
          </span>
          <span className="rounded border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            MODO OTIMIZADO ATIVO
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Você está poupando{" "}
          <span className="font-medium text-blue-400/80">
            {savings.savedTokens.toLocaleString()} tokens
          </span>{" "}
          limpando comentários e espaços.
        </p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500">
          <Zap size={12} className="fill-emerald-500" />
          PRONTO
        </div>
      </div>
    </div>
  );
}
