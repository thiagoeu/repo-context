import { ViewMode } from "@/utils/generatePrompt";

interface PromptModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function PromptModeToggle({
  viewMode,
  setViewMode,
}: PromptModeToggleProps) {
  return (
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
  );
}
