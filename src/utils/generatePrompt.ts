import { FileNode } from "@/types/fileNode";
import { cleanCode, treeToText } from "./treeToText";

export type ViewMode = "preview" | "optimized";

interface GeneratePromptParams {
  selectedFiles: FileNode[];
  selectedFolder: FileNode | null;
  viewMode: ViewMode;
}

export function generatePrompt({
  selectedFiles,
  selectedFolder,
  viewMode,
}: GeneratePromptParams) {
  if (selectedFiles.length === 0) {
    return selectedFolder ? treeToText([selectedFolder]) : "";
  }

  return selectedFiles
    .map((file) => {
      const content = file.content || "";

      if (viewMode === "optimized") {
        const cleaned = cleanCode(content);

        return `<file path="${file.path}">
${cleaned}
</file>`;
      }

      return `--- FILE: ${file.path} ---
${content}
`;
    })
    .join("\n\n");
}
