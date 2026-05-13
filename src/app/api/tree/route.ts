import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FileNode, ignoredFolders } from "@/types/fileNode";

function scanDirectory(dirPath: string): FileNode[] {
  const entries = fs.readdirSync(dirPath, {
    withFileTypes: true,
  });

  const nodes: FileNode[] = [];

  for (const entry of entries) {
    if (ignoredFolders.includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: "folder",
        children: scanDirectory(fullPath),
      });
    } else {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: "file",
      });
    }
  }

  return nodes;
}

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
