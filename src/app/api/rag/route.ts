import { NextRequest, NextResponse } from "next/server";
import { indexFiles, search } from "@/services/rag/vectorStore";
import { askModel } from "@/agents/shared/providers/ollama";
import type { Message } from "@/agents/shared/types/message";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, files, query } = body;

    // Ação: indexar arquivos
    if (action === "index") {
      if (!files || !Array.isArray(files)) {
        return NextResponse.json(
          { error: "Lista de arquivos obrigatória" },
          { status: 400 },
        );
      }
      await indexFiles(files);
      return NextResponse.json({
        success: true,
        message: "Indexação concluída.",
      });
    }

    // Ação: fazer uma pergunta
    if (action === "ask") {
      if (!query) {
        return NextResponse.json(
          { error: "Pergunta obrigatória" },
          { status: 400 },
        );
      }

      // Busca os chunks mais relevantes
      const topChunks = await search(query, 5);

      if (topChunks.length === 0) {
        return NextResponse.json({
          answer:
            "Não encontrei informações relevantes no código para responder sua pergunta.",
          context: [],
        });
      }

      // Monta o contexto
      const context = topChunks
        .map((chunk) => `Arquivo: ${chunk.filePath}\n${chunk.text}`)
        .join("\n\n");

      // Sistema de prompt
      const systemPrompt = `Você é um assistente especialista no código do projeto RepoContext.
Responda a pergunta do usuário com base APENAS no contexto fornecido.
Se a resposta não estiver no contexto, diga que não sabe.
Seja objetivo e direto.

Contexto:
${context}`;

      const messages: Message[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ];

      const response = await askModel({
        messages,
        options: { temperature: 0.3, numPredict: 500 },
      });

      const answer =
        response.message?.content || "Não foi possível gerar uma resposta.";

      return NextResponse.json({
        answer,
        context: topChunks.map((c) => ({ file: c.filePath, text: c.text })),
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error: any) {
    console.error("Erro no RAG:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 },
    );
  }
}
