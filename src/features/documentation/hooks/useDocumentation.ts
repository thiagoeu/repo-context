import { useState } from "react";
import { FileNode } from "@/types/fileNode";

export function useDocumentation() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [docs, setDocs] = useState<Map<string, string>>(new Map());

  const generate = async (files: FileNode[]) => {
    if (files.length === 0) return;
    setIsGenerating(true);
    const newDocs = new Map(docs);

    await Promise.all(
      files.map(async (file) => {
        if (newDocs.has(file.path)) return; // já documentado
        try {
          const res = await fetch("/api/document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: file.path }),
          });
          const data = await res.json();
          console.log(`Resposta para ${file.path}:`, data);
          if (res.ok) {
            newDocs.set(file.path, data.documentation);
          } else {
            newDocs.set(
              file.path,
              `❌ Erro: ${data.error || "Falha na geração"}`,
            );
          }
        } catch (error) {
          newDocs.set(file.path, `❌ Erro: ${String(error)}`);
        }
      }),
    );

    setDocs(newDocs);
    setIsGenerating(false);
  };

  const clear = () => setDocs(new Map());

  return { isGenerating, docs, generate, clear };
}
