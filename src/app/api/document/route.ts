import { NextResponse } from "next/server";
import { askModel } from "@/agents/shared/providers/ollama";
import { buildDocumentationPrompt } from "@/agents/documentation/prompt";
import { documentationToolsDefinition, lerArquivoLocal } from "@/agents/documentation/tools";
import type { Message } from "@/agents/shared/types/message";


export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();
    if (!filePath) {
      return NextResponse.json(
        { error: "Caminho do arquivo é obrigatório" },
        { status: 400 },
      );
    }

    console.log(`📄 Solicitada documentação para: ${filePath}`);

    // 1. Mensagem inicial
    const messages: Message[] = [
      { role: "system", content: buildDocumentationPrompt() },
      { role: "user", content: `Por favor, documente o arquivo: ${filePath}` },
    ];

    // 2. Primeira chamada – pode solicitar ferramenta
    console.log("🟡 Chamando Ollama (com tools)...");
    let data = await askModel({
      messages,
      options: {
        temperature: 0.2,
        tools: documentationToolsDefinition,
        numPredict: 1000,
      },
    });
    console.log("🟢 Resposta inicial recebida");

    let conteudoDoArquivo = "";

    // 3. Se houver tool call, executar e fazer segunda chamada
    if (data.message?.tool_calls?.length > 0) {
      const toolCall = data.message.tool_calls[0];
      console.log(`🔧 Tool call: ${toolCall.function.name}`);

      if (toolCall.function.name === "lerArquivoLocal") {
        const args = toolCall.function.arguments as {
          caminhoDoArquivo: string;
        };
        conteudoDoArquivo = lerArquivoLocal(args.caminhoDoArquivo);
        console.log(
          `📄 Conteúdo lido (${conteudoDoArquivo.length} caracteres)`,
        );

        // Adiciona a resposta da tool ao histórico
        messages.push(data.message as Message);
        messages.push({
          role: "assistant", // ou "tool" se o Ollama suportar, mas usamos assistant
          content: conteudoDoArquivo,
        } as Message);

        // Adiciona um prompt explícito para gerar a documentação
        messages.push({
          role: "user",
          content:
            "Agora, com base no conteúdo do arquivo fornecido, gere uma documentação técnica completa em Markdown, incluindo propósito, descrição das funções/classes e um exemplo de uso.",
        });

        console.log("🟡 Chamando Ollama para gerar documentação...");
        data = await askModel({
          messages,
          options: {
            temperature: 0.3,
            numPredict: 1500,
          },
        });
        console.log("🟢 Documentação gerada");
      }
    }

    // 4. Extrai a resposta
    let documentation = data.message?.content || "";

    // 5. Fallback: se veio vazio, usar o conteúdo do arquivo (ou mensagem de erro)
    if (!documentation.trim()) {
      console.warn("⚠️ Documentação vazia, usando fallback.");
      if (conteudoDoArquivo) {
        documentation = `⚠️ A IA não gerou documentação. Segue o conteúdo do arquivo para referência:\n\n\`\`\`\n${conteudoDoArquivo}\n\`\`\``;
      } else {
        documentation =
          "❌ Não foi possível gerar documentação. Verifique o arquivo e tente novamente.";
      }
    }

    console.log(`📝 Documentação final (${documentation.length} caracteres)`);
    return NextResponse.json({ documentation });
  } catch (error: any) {
    console.error("❌ Erro na API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 },
    );
  }
}
