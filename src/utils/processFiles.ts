import { FileNode } from "@/types/fileNode";
import { cleanCode } from "@/utils";

export interface ProcessedFile extends FileNode {
  originalContent: string;
  cleanedContent: string;
}

export function processFiles(selectedFiles: FileNode[]): ProcessedFile[] {
  return selectedFiles.map((file) => {
    const originalContent = file.content || "";

    return {
      ...file,
      originalContent,
      cleanedContent: cleanCode(originalContent),
    };
  });
}
