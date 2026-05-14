"use client";

import { FileNode } from "@/types/fileNode";
import { usePromptPreview } from "@/hooks/usePromptPreview";
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

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex min-h-[38px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
            Prompt Preview
          </h2>
          <PromptStats chars={stats.chars} tokens={stats.tokens} />
        </div>

        <PromptModeToggle viewMode={viewMode} setViewMode={setViewMode} />

        <CopyButton
          copied={copied}
          disabled={!displayContent}
          onCopy={handleCopy}
        />
      </div>

      <PromptContent
        viewMode={viewMode}
        selectedFilesCount={selectedFiles.length}
        displayContent={displayContent}
        savings={savings}
      />
    </div>
  );
}
