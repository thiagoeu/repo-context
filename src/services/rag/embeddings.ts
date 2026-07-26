/**
 * Gera um embedding para um texto usando o Ollama.
 * Reutiliza a chamada que já testamos.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao gerar embedding: ${response.status}`);
  }

  const data = await response.json();
  return data.embedding;
}
