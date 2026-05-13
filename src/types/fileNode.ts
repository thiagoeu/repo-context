export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}

export const ignoredFolders = [
  "node_modules",
  "package-lock.json",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".env",
  ".husky",
  ".vscode",
  ".github",
  ".gitlab",
];
