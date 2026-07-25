import { NextRequest, NextResponse } from "next/server";
import { readFileContent } from "@/services/filesystem";

export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "Caminho do arquivo obrigatório" },
        { status: 400 },
      );
    }

    const content = readFileContent(filePath);

    if (content === null) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao ler o conteúdo do arquivo" },
      { status: 500 },
    );
  }
}
