import { ProcessedFile } from "@/utils";

interface SavingsResult {
  percentage: number;
  diff: number;
}

export function calculateSavings(
  processedFiles: ProcessedFile[],
): SavingsResult | null {
  if (processedFiles.length === 0) {
    return null;
  }

  const normalChars = processedFiles.reduce((acc, file) => {
    return acc + file.originalContent.length + 20;
  }, 0);

  const optimizedChars = processedFiles.reduce((acc, file) => {
    return acc + file.cleanedContent.length + 30;
  }, 0);

  const diff = normalChars - optimizedChars;

  const percentage =
    normalChars > 0 ? Math.max(0, Math.round((diff / normalChars) * 100)) : 0;

  return {
    percentage,
    diff: Math.max(0, Math.ceil(diff / 4)),
  };
}
