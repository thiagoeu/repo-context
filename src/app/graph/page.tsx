"use client";

import { useEffect, useState } from "react";
import GraphView from "@/features/code-graph/components/GraphView";
import type { GraphData } from "@/agents/graph/tools";
import { GitBranch } from "lucide-react";

const STORAGE_KEY = "repo-context:graph-data";

export default function GraphPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setError(true);
        return;
      }
      setGraphData(JSON.parse(raw));
    } catch {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-500">
        <GitBranch size={40} className="text-zinc-700" />
        <p className="text-sm">Nenhum grafo encontrado.</p>
        <p className="text-xs text-zinc-600">
          Gere um grafo na janela principal primeiro.
        </p>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <GitBranch size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-zinc-200">
            Code Graph — Visualização Completa
          </span>
          <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400">
            {graphData.nodes.length} nós · {graphData.edges.length} arestas
          </span>
        </div>
        <span className="text-[10px] text-zinc-600">RepoContext</span>
      </div>

      {/* Full-screen graph */}
      <div className="flex-1 overflow-hidden">
        <GraphView data={graphData} />
      </div>
    </div>
  );
}
