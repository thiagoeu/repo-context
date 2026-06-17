import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { askModel } from "./shared/providers/ollama.js";
import type { Message } from "./shared/types/message.js";
import { buildSystemPrompt } from "./prompt.js";
import { toolsDefinition, lerArquivoLocal } from "./tools.js";

const rl = readline.createInterface({ input, output });

// Iniciamos as mensagens com o System Prompt de Especialista
const messages: Message[] = [
  {
    role: "system",
    content: buildSystemPrompt(),
  },
];

async function chat() {
  console.log("=== Agente de Documentação Local Iniciado ===");
  console.log(
    "Exemplo de uso: 'Documente o arquivo ./src/shared/providers/ollama.ts'",
  );
  console.log("Digite 'sair' para encerrar.\n");

  while (true) {
    const userInput = await rl.question("Você: ");

    if (userInput.toLowerCase() === "sair") {
      rl.close();
      break;
    }

    // 1. Adiciona a pergunta do usuário ao histórico
    messages.push({ role: "user", content: userInput });

    console.log("\n[IA pensando...]");
    console.time("Tempo de resposta");

    // 2. Fazemos a chamada passando as definições das ferramentas (tools)
    let data = await askModel({
      messages,
      options: {
        temperature: 0.2, // Temperatura baixa para ser mais preciso na documentação
        tools: toolsDefinition,
        numPredict: 800, // Maior para caber códigos e documentações longas
      },
    });

    console.timeEnd("Tempo de resposta");

    // 3. Verificamos se o Ollama quer chamar uma função (Tool Calling)
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

        // Executamos a nossa função real do Node.js
        const conteudoDoArquivo = lerArquivoLocal(args.caminhoDoArquivo);

        // Salvamos o pedido da IA no histórico (obrigatório no fluxo de Tools)
        messages.push(data.message);

        // Enviamos o conteúdo do arquivo de volta para a IA com o role "tool"
        messages.push({
          role: "tool",
          content: conteudoDoArquivo,
        } as any);

        // Fazemos a segunda chamada para a IA ler o conteúdo do arquivo e gerar a resposta final
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

    // 4. Exibe a resposta final (a documentação em Markdown)
    const answer = data.message.content;
    console.log(`\nIA:\n${answer}\n`);

    // Adiciona a resposta final da IA ao histórico para manter o contexto do chat
    messages.push({ role: "assistant", content: answer });
  }
}

chat().catch(console.error);
