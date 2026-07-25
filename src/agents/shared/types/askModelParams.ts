import type { Message } from "./message";
import type { AskModelOptions } from "./askModelOptions";

export interface AskModelParams {
  messages: Message[];
  options?: AskModelOptions;
}
