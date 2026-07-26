"use client";

import { useState } from "react";
import { FileNode } from "@/types/fileNode";
import type { GraphData } from "@/agents/graph/tools";
const GRAPH_STORAGE_KEY = "repo-context:graph-data";
interface UseCodeGraphReturn {
  graphData: GraphData | null;
  isAnalyzing: boolean;
  error: string | null;
  analyze: (files: FileNode[]) => Promise<void>;
  clear: () => void;
}

export function useCodeGraph(): UseCodeGraphReturn {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(files: FileNode[]) {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const payload = files
        .filter((f) => f.content)
        .map((f) => ({ path: f.path, content: f.content! }));

      if (payload.length === 0) {
        setError("Nenhum arquivo com conteúdo selecionado.");
        return;
      }

      const response = await fetch("/api/graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao analisar grafo.");
        return;
      }

      setGraphData(data);
      localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function clear() {
    setGraphData(null);
    setError(null);
    localStorage.removeItem(GRAPH_STORAGE_KEY);
  }

  return { graphData, isAnalyzing, error, analyze, clear };
}
