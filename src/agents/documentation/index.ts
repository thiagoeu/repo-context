import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { askModel } from "../shared/providers/ollama.js";
import type { Message } from "../shared/types/message.js";
import { buildDocumentationPrompt } from "./prompt.js";
import { documentationToolsDefinition, lerArquivoLocal } from "./tools.js";

const rl = readline.createInterface({ input, output });

const messages: Message[] = [
  {
    role: "system",
    content: buildDocumentationPrompt(),
  },
];

async function chat() {
  console.log("=== Agente de Documentação Local Iniciado ===");
  console.log(
    "Exemplo de uso: 'Documente o arquivo ./src/agents/shared/providers/ollama.ts'",
  );
  console.log("Digite 'sair' para encerrar.\n");

  while (true) {
    const userInput = await rl.question("Você: ");

    if (userInput.toLowerCase() === "sair") {
      rl.close();
      break;
    }

    messages.push({ role: "user", content: userInput });

    console.log("\n[IA pensando...]");
    console.time("Tempo de resposta");

    let data = await askModel({
      messages,
      options: {
        temperature: 0.2,
        tools: documentationToolsDefinition,
        numPredict: 800,
      },
    });

    console.timeEnd("Tempo de resposta");

    if (
      data.message &&
      data.message.tool_calls &&
      data.message.tool_calls.length > 0
    ) {
      const toolCall = data.message.tool_calls[0];

      if (toolCall.function.name === "lerArquivoLocal") {
        const args = toolCall.function.arguments as {
          caminhoDoArquivo: string;
        };
        console.log(
          `\n⚙️ [Agente executando ferramenta]: Lendo o arquivo "${args.caminhoDoArquivo}"...`,
        );

        const conteudoDoArquivo = lerArquivoLocal(args.caminhoDoArquivo);

        messages.push(data.message);
        messages.push({
          role: "tool",
          content: conteudoDoArquivo,
        } as Message);

        console.log("[IA gerando documentação com base no arquivo...]");
        console.time("Tempo de geração");

        data = await askModel({
          messages,
          options: {
            temperature: 0.3,
          },
        });

        console.timeEnd("Tempo de geração");
      }
    }

    const answer = data.message.content;
    console.log(`\nIA:\n${answer}\n`);

    messages.push({ role: "assistant", content: answer });
  }
}

chat().catch(console.error);
