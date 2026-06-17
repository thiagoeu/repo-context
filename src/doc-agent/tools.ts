import fs from "node:fs";
import path from "node:path";

// 1. O Ollama lê este JSON para entender o que o seu script Node consegue fazer
export const toolsDefinition = [
  {
    type: "function",
    function: {
      name: "lerArquivoLocal",
      description:
        "Lê o conteúdo de um arquivo do projeto para que você possa analisar o código e criar a documentação.",
      parameters: {
        type: "object",
        properties: {
          caminhoDoArquivo: {
            type: "string",
            description:
              "O caminho relativo do arquivo no projeto (ex: ./src/shared/providers/ollama.ts)",
          },
        },
        required: ["caminhoDoArquivo"],
      },
    },
  },
];

// 2. Esta é a função real que o Node vai executar quando a IA decidir usar a ferramenta acima
export function lerArquivoLocal(caminhoDoArquivo: string): string {
  try {
    const caminhoAbsoluto = path.resolve(caminhoDoArquivo);

    if (!fs.existsSync(caminhoAbsoluto)) {
      return `Erro: O arquivo no caminho "${caminhoDoArquivo}" não foi encontrado.`;
    }

    return fs.readFileSync(caminhoAbsoluto, "utf-8");
  } catch (error: any) {
    return `Erro ao ler o arquivo: ${error.message}`;
  }
}
