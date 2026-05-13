"use client";

import { useState } from "react";
import { treeToText } from "@/utils/treeToText";
import { FileNode } from "@/types/fileNode";

interface PromptPreviewProps {
  selectedFolder: FileNode | null;
}

export default function PromptPreview({ selectedFolder }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!selectedFolder) return;
    const text = treeToText([selectedFolder]);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm text-zinc-400">Prompt Preview</h2>
        <button
          onClick={handleCopy}
          disabled={!selectedFolder}
          className={`rounded px-3 py-1 text-xs transition-all disabled:opacity-50 ${
            copied
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {copied ? "Copied ✅" : "Copy"}
        </button>
      </div>

      <pre className="flex-1 overflow-auto rounded-xl border border-zinc-800 bg-black p-4 font-mono text-sm whitespace-pre-wrap text-zinc-300">
        {selectedFolder
          ? treeToText([selectedFolder])
          : "Nenhuma pasta selecionada"}
      </pre>
    </div>
  );
}
