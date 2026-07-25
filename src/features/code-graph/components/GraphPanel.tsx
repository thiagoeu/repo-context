"use client";

import { FileNode } from "@/types/fileNode";
import { useCodeGraph } from "../hooks/useCodeGraph";
import GraphView from "./GraphView";
import { GitBranch, RefreshCw, Trash2, AlertCircle } from "lucide-react";

interface GraphPanelProps {
  selectedFiles: FileNode[];
}

export default function GraphPanel({ selectedFiles }: GraphPanelProps) {
  const { graphData, isAnalyzing, error, analyze, clear } = useCodeGraph();

  const filesWithContent = selectedFiles.filter((f) => f.content);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Header */}
      <div className="flex min-h-9.5 items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-200">
            <GitBranch size={14} className="text-purple-400" />
            Code Graph
          </h2>

          {graphData && (
            <div className="flex items-center gap-1.5 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-400">
              {graphData.nodes.length} nós · {graphData.edges.length} arestas
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {graphData && (
            <button
              onClick={clear}
              title="Limpar grafo"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={11} />
              LIMPAR
            </button>
          )}

          <button
            onClick={() => analyze(selectedFiles)}
            disabled={isAnalyzing || filesWithContent.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <GitBranch size={12} />
                Analisar Grafo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {isAnalyzing && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-zinc-500">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />
              <GitBranch
                size={20}
                className="absolute inset-0 m-auto text-purple-400"
              />
            </div>
            <p className="text-sm italic">Analisando dependências...</p>
            <p className="text-xs text-zinc-600">
              {filesWithContent.length} arquivo(s) em processamento
            </p>
          </div>
        )}

        {!isAnalyzing && !error && !graphData && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-600">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
              <GitBranch size={28} className="text-zinc-700" />
            </div>
            <p className="text-sm">
              {filesWithContent.length === 0
                ? "Selecione arquivos com conteúdo para analisar"
                : `${filesWithContent.length} arquivo(s) prontos para análise`}
            </p>
            {filesWithContent.length > 0 && (
              <button
                onClick={() => analyze(selectedFiles)}
                className="mt-1 flex items-center gap-2 rounded-lg bg-purple-600/20 border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-400 transition hover:bg-purple-600/30 hover:text-purple-300"
              >
                <GitBranch size={14} />
                Gerar Grafo
              </button>
            )}
          </div>
        )}

        {!isAnalyzing && !error && graphData && (
          <GraphView data={graphData} />
        )}
      </div>
    </div>
  );
}
