"use client";

import { useState } from "react";
import { FileNode } from "@/types/fileNode";
import { useDocumentation } from "@/hooks/useDocumentation";
import { usePromptPreview } from "@/hooks/usePromptPreview";
import DocumentationPanel from "@/components/DocumentationPanel";
import {
  PromptStats,
  PromptModeToggle,
  CopyButton,
  PromptContent,
} from "@/components";

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

  // Hook para gerenciar a documentação
  const { isGenerating, docs, generate, clear } = useDocumentation();
  const [isDocPanelOpen, setIsDocPanelOpen] = useState(false);

  // Função para gerar documentação e abrir o modal
  const handleGenerateDoc = async () => {
    if (selectedFiles.length === 0) return;
    await generate(selectedFiles);
    setIsDocPanelOpen(true);
  };

  // Fechar o modal e limpar docs (opcional)
  const handleCloseDocs = () => {
    setIsDocPanelOpen(false);
    // clear(); // se quiser limpar ao fechar, descomente
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex min-h-9.5 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
            Prompt Preview
          </h2>
          <PromptStats chars={stats.chars} tokens={stats.tokens} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PromptModeToggle viewMode={viewMode} setViewMode={setViewMode} />

          {/* Botão Documentar */}
          <button
            onClick={handleGenerateDoc}
            disabled={isGenerating || selectedFiles.length === 0}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isGenerating ? "⏳ Gerando..." : "📄 Documentar"}
          </button>

          <CopyButton
            copied={copied}
            disabled={!displayContent}
            onCopy={handleCopy}
          />
        </div>
      </div>

      <PromptContent
        viewMode={viewMode}
        selectedFilesCount={selectedFiles.length}
        displayContent={displayContent}
        savings={savings}
      />

      {/* Modal de documentação */}
      <DocumentationPanel
        docs={docs}
        isOpen={isDocPanelOpen}
        onClose={handleCloseDocs}
      />
    </div>
  );
}
