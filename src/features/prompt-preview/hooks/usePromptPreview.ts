import { useEffect, useMemo, useState } from "react";
import { FileNode } from "@/types/fileNode";

import {
  processFiles,
  generatePrompt,
  ViewMode,
  generateStats,
  calculateSavings,
} from "@/utils";

interface UsePromptPreviewProps {
  selectedFiles: FileNode[];
  selectedFolder: FileNode | null;
}

export function usePromptPreview({
  selectedFiles,
  selectedFolder,
}: UsePromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("optimized");

  const processedFiles = useMemo(() => {
    return processFiles(selectedFiles);
  }, [selectedFiles]);

  const displayContent = useMemo(() => {
    return generatePrompt({
      processedFiles,
      selectedFolder,
      viewMode,
    });
  }, [processedFiles, selectedFolder, viewMode]);

  const stats = useMemo(() => {
    return generateStats({
      content: displayContent,
      fileCount: selectedFiles.length,
    });
  }, [displayContent, selectedFiles.length]);

  const savings = useMemo(() => {
    return calculateSavings(processedFiles);
  }, [processedFiles]);

  async function handleCopy() {
    if (!displayContent) return;

    try {
      // Tenta Clipboard API
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
    } catch {
      // Fallback: textarea
      const textArea = document.createElement("textarea");
      textArea.value = displayContent;
      textArea.style.cssText =
        "position:fixed;left:-9999px;top:-9999px;opacity:0;";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (success) {
        setCopied(true);
      } else {
        alert("Não foi possível copiar. Selecione manualmente.");
      }
    }
  }

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [copied]);

  return {
    copied,
    viewMode,
    setViewMode,
    displayContent,
    stats,
    savings,
    handleCopy,
  };
}
