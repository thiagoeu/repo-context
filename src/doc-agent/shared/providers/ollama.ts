import type { AskModelParams } from "../types/askModelParams.js";

const BASE_URL = "http://localhost:11434/api/chat";

export async function askModel({ messages, options = {} }: AskModelParams) {
  const {
    model = "llama3.2",
    temperature = 0.4,
    numPredict = 500,
    stream = false,
  } = options;

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      tools: options.tools,
      options: {
        temperature,
        num_predict: numPredict,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}
