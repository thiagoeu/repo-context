"use client";
import { useState, useRef, useEffect } from "react";
import { useRagChat } from "../hooks/useRagChat";
import { FileNode } from "@/types/fileNode";

interface ChatWidgetProps {
  selectedFiles: FileNode[];
}

export default function ChatWidget({ selectedFiles }: ChatWidgetProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isSending, isIndexed, indexProject } =
    useRagChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const filesWithContent = selectedFiles.filter((f) => f.content);

  return (
    <div className="mt-6 border-t border-zinc-800 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">
          💬 Chat com o Projeto
        </h2>
        <div className="flex gap-2">
          {!isIndexed ? (
            <button
              onClick={() => indexProject(filesWithContent)}
              disabled={filesWithContent.length === 0}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Indexar ({filesWithContent.length} arquivos)
            </button>
          ) : (
            <span className="text-xs text-green-400">✓ Indexado</span>
          )}
        </div>
      </div>

      <div className="h-64 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            {isIndexed
              ? "Faça uma pergunta sobre o código do projeto."
              : "Clique em Indexar para começar."}
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-200"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {isSending && (
          <div className="text-left text-sm text-zinc-400 italic">
            Pensando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            isIndexed
              ? "Pergunte sobre o código..."
              : "Indexe o projeto primeiro"
          }
          disabled={!isIndexed || isSending}
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!isIndexed || isSending || !input.trim()}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
