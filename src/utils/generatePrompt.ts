import { FileNode } from "@/types/fileNode";
import { ProcessedFile, treeToText } from "@/utils";

export type ViewMode = "preview" | "optimized";

interface GeneratePromptParams {
  processedFiles: ProcessedFile[];
  selectedFolder: FileNode | null;
  viewMode: ViewMode;
}

export function generatePrompt({
  processedFiles,
  selectedFolder,
  viewMode,
}: GeneratePromptParams) {
  if (processedFiles.length === 0) {
    return selectedFolder ? treeToText([selectedFolder]) : "";
  }

  return processedFiles
    .map((file) => {
      if (viewMode === "optimized") {
        return `<file path="${file.path}">
${file.cleanedContent}
</file>`;
      }

      return `--- FILE: ${file.path} ---
${file.originalContent}
`;
    })
    .join("\n\n");
}
