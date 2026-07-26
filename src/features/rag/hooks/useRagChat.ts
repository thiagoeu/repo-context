import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useRagChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);

  const indexProject = useCallback(async (files: any[]) => {
    if (files.length === 0) {
      alert("Selecione alguns arquivos primeiro.");
      return;
    }

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "index", files }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsIndexed(true);
        alert(`✅ Indexado com sucesso! (${data.message})`);
      } else {
        alert("❌ Erro ao indexar: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao indexar.");
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      if (!isIndexed) {
        alert("Indexe o projeto antes de perguntar.");
        return;
      }

      setIsSending(true);
      setMessages((prev) => [...prev, { role: "user", content }]);

      try {
        const res = await fetch("/api/rag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ask", query: content }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.answer },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "❌ Erro: " + data.error },
          ]);
        }
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Erro ao obter resposta." },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [isIndexed],
  );

  return { messages, sendMessage, isSending, isIndexed, indexProject };
}
