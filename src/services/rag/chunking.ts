/**
 * Divide um texto em chunks de aproximadamente maxChunkSize caracteres,
 * respeitando as quebras de linha para não cortar linhas no meio.
 */
export function chunkText(text: string, maxChunkSize: number = 500): string[] {
  const lines = text.split("\n");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const line of lines) {
    // Se adicionar a linha ultrapassar o limite, finaliza o chunk atual
    if (
      currentChunk.length + line.length > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += line + "\n";
  }

  // Último chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
