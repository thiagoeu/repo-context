"use client";

import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocumentationPanelProps {
  docs: Map<string, string>;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationPanel({
  docs,
  isOpen,
  onClose,
}: DocumentationPanelProps) {
  if (!isOpen || docs.size === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h3 className="text-lg font-bold text-zinc-100">
            📄 Documentação Gerada
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-800"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="max-h-[calc(80vh-100px)] overflow-y-auto p-6">
          {Array.from(docs.entries()).map(([path, content]) => (
            <div key={path} className="mb-6 last:mb-0">
              <div className="mb-2 text-sm font-semibold text-blue-400">
                {path}
              </div>
              <div className="prose prose-invert max-w-none rounded-lg bg-zinc-800/50 p-4 text-sm leading-relaxed text-zinc-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
