import { Hash, Zap } from "lucide-react";

interface PromptStatsProps {
  chars: string;
  tokens: string;
}

export default function PromptStats({ chars, tokens }: PromptStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-[10px] font-medium text-zinc-400">
        <Hash size={10} className="text-zinc-500" />

        <span>{chars} chars</span>
      </div>

      <div className="flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400">
        <Zap size={10} />

        <span>~{tokens} tokens</span>
      </div>
    </div>
  );
}
