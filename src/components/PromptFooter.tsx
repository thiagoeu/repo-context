import { Zap } from "lucide-react";

interface PromptFooterProps {
  percentage: number;
  diff: number;
}

export default function PromptFooter({ percentage, diff }: PromptFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-zinc-800/50 bg-zinc-900/20 px-4 py-2">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="flex items-center gap-1 font-bold text-emerald-400">
          <Zap size={12} className="fill-emerald-400" />
          {percentage}% ECONOMIA
        </span>

        <span className="text-zinc-600">|</span>

        <span className="text-zinc-500 italic">
          ~{diff.toLocaleString()} tokens poupados
        </span>
      </div>

      <span className="text-[9px] font-bold tracking-tighter text-zinc-600 uppercase">
        AI Context Ready
      </span>
    </div>
  );
}
