export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}
