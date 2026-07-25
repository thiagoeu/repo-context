import { NextRequest, NextResponse } from "next/server";
import { scanDirectory } from "@/services/filesystem";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dirPath } = body;

    if (!dirPath) {
      return NextResponse.json({ error: "Path obrigatório" }, { status: 400 });
    }

    const tree = scanDirectory(dirPath);
    return NextResponse.json(tree);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao ler diretório" },
      { status: 500 },
    );
  }
}
