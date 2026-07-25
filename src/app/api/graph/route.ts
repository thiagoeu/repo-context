import { NextRequest, NextResponse } from "next/server";
import { analyzeFiles } from "@/agents/graph/tools";
import type { FileInput } from "@/agents/graph/tools";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { files } = body as { files: FileInput[] };

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Lista de arquivos obrigatória" },
        { status: 400 },
      );
    }

    console.log(`🔍 Analisando grafo para ${files.length} arquivo(s)...`);

    // Análise estática via regex (rápida e confiável)
    const graphData = analyzeFiles(files);

    console.log(
      `✅ Grafo gerado: ${graphData.nodes.length} nós, ${graphData.edges.length} arestas`,
    );

    return NextResponse.json(graphData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    console.error("❌ Erro na API de grafo:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
