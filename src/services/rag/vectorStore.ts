import { FileNode } from "@/types/fileNode";
import { chunkText } from "./chunking";
import { cosineSimilarity } from "./similarity";
import { generateEmbedding } from "./embeddings";

interface Chunk {
  id: string; // identificador único: filePath + index
  text: string;
  filePath: string;
  embedding?: number[];
}

// Banco de dados em memória
let chunks: Chunk[] = [];

/**
 * Indexa uma lista de arquivos.
 * Cada arquivo é dividido em chunks, e para cada chunk é gerado um embedding.
 */
export async function indexFiles(files: FileNode[]): Promise<void> {
  const allChunks: Chunk[] = [];

  for (const file of files) {
    if (!file.content) continue;

    const textChunks = chunkText(file.content);
    for (let i = 0; i < textChunks.length; i++) {
      allChunks.push({
        id: `${file.path}:${i}`,
        text: textChunks[i],
        filePath: file.path,
      });
    }
  }

  // Gerar embeddings para todos os chunks (um por um)
  for (const chunk of allChunks) {
    try {
      const embedding = await generateEmbedding(chunk.text);
      chunk.embedding = embedding;
    } catch (error) {
      console.error(`Erro ao gerar embedding para chunk ${chunk.id}:`, error);
      // Se falhar, deixamos sem embedding (será ignorado na busca)
    }
  }

  // Substitui o banco de chunks (descarta os antigos)
  chunks = allChunks;
  console.log(
    `✅ Indexados ${chunks.length} chunks de ${files.length} arquivos.`,
  );
}

/**
 * Busca os chunks mais relevantes para uma pergunta.
 * Retorna os topK chunks com maior similaridade.
 */
export async function search(
  query: string,
  topK: number = 5,
): Promise<Chunk[]> {
  if (chunks.length === 0) {
    throw new Error("Nenhum chunk indexado. Execute a indexação primeiro.");
  }

  // Gerar embedding da pergunta
  const queryEmbedding = await generateEmbedding(query);

  // Calcular similaridade com todos os chunks que têm embedding
  const scored: (Chunk & { score: number })[] = [];
  for (const chunk of chunks) {
    if (!chunk.embedding) continue; // ignorar chunks sem embedding
    const score = cosineSimilarity(queryEmbedding, chunk.embedding);
    scored.push({ ...chunk, score });
  }

  // Ordenar por score decrescente
  scored.sort((a, b) => b.score - a.score);

  // Retornar os topK
  return scored.slice(0, topK);
}
