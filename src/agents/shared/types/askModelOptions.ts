export interface AskModelOptions {
  model?: string;
  temperature?: number;
  numPredict?: number;
  stream?: boolean;
  tools?: unknown[];
  format?: "json";
}
