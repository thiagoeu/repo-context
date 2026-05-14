import { FileNode } from "@/types/fileNode";
import { cleanCode } from "./treeToText";

interface SavingsResult {
  percentage: number;
  diff: number;
}

export function calculateSavings(
  selectedFiles: FileNode[],
): SavingsResult | null {
  if (selectedFiles.length === 0) {
    return null;
  }

  const normalChars = selectedFiles.reduce((acc, file) => {
    return acc + (file.content?.length || 0) + 20;
  }, 0);

  const optimizedChars = selectedFiles.reduce((acc, file) => {
    const cleaned = cleanCode(file.content || "");

    return acc + cleaned.length + 30;
  }, 0);

  const diff = normalChars - optimizedChars;

  const percentage =
    normalChars > 0 ? Math.max(0, Math.round((diff / normalChars) * 100)) : 0;

  return {
    percentage,
    diff: Math.max(0, Math.ceil(diff / 4)),
  };
}
