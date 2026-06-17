import type { AskModelOptions } from "./askModelOptions.js";
import type { Message } from "./message.js";

export type AskModelParams = {
  messages: Message[];
  options?: AskModelOptions;
};
