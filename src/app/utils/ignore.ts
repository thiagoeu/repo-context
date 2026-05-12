const ignoredFolders = [
  "node_modules",
  ".env",
  ".husky",
  ".vscode",
  ".github",
  ".gitlab",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
];

const ignoredFiles = [".DS_Store"];

export function shouldIgnore(path: string) {
  const parts = path.split("/");

  const hasIgnoredFolder = parts.some((part) => ignoredFolders.includes(part));

  const isIgnoredFile = ignoredFiles.some((file) => path.endsWith(file));

  return hasIgnoredFolder || isIgnoredFile;
}
