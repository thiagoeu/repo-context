import { FileNode } from "@/types/fileNode";

export function buildTree(files: File[]): FileNode[] {
  const root: FileNode[] = [];

  files.forEach((file) => {
    const parts = file.webkitRelativePath.split("/");

    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      let existing = currentLevel.find((item) => item.name === part);

      if (!existing) {
        existing = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
        };

        currentLevel.push(existing);
      }

      if (existing.children) {
        currentLevel = existing.children;
      }
    });
  });

  return root;
}
