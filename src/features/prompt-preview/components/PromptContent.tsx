import { ViewMode } from "@/utils/generatePrompt";

import PromptFooter from "@/features/prompt-preview/components/PromptFooter";

interface PromptContentProps {
  viewMode: ViewMode;
  selectedFilesCount: number;
  displayContent: string;

  savings?: {
    percentage: number;
    diff: number;
  } | null;
}

export default function PromptContent({
  viewMode,
  selectedFilesCount,
  displayContent,
  savings,
}: PromptContentProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0a]">
      {viewMode === "optimized" && selectedFilesCount > 0 && (
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
        <PromptFooter percentage={savings.percentage} diff={savings.diff} />
      )}
    </div>
  );
}
