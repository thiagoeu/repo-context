"use client";

import { useMemo, useState } from "react";
import { FileNode } from "@/types/fileNode";

export function useFileExplorer() {
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileNode[]>([]);

  const selectedPaths = useMemo(
    () => selectedFiles.map((f) => f.path),
    [selectedFiles],
  );

  const rootFolders = useMemo(
    () => tree.filter((node) => node.type === "folder"),
    [tree],
  );

  async function handleScan(path: string) {
    if (!path.trim()) return alert("Digite um caminho");
    setLoading(true);
    try {
      const response = await fetch("/api/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dirPath: path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro");
      setTree(data);
      const firstFolder = data.find((node: FileNode) => node.type === "folder");
      setSelectedFolder(firstFolder || null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFileContent(file: FileNode): Promise<FileNode> {
    const response = await fetch("/api/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath: file.path }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { ...file, content: data.content };
  }

  async function handleFileSelect(node: FileNode) {
    if (node.type === "folder") return;

    if (selectedPaths.includes(node.path)) {
      setSelectedFiles((prev) => prev.filter((f) => f.path !== node.path));
      return;
    }

    try {
      const fileWithContent = await fetchFileContent(node);
      setSelectedFiles((prev) => [...prev, fileWithContent]);
    } catch {
      alert("Não foi possível ler o arquivo.");
    }
  }

  async function handleFolderToggle(folderNode: FileNode, checked: boolean) {
    const allFileNodes: FileNode[] = [];
    function collect(node: FileNode) {
      if (node.type === "file") allFileNodes.push(node);
      else if (node.children) node.children.forEach(collect);
    }
    collect(folderNode);

    if (checked) {
      const filesToFetch = allFileNodes.filter(
        (f) => !selectedFiles.some((sf) => sf.path === f.path && sf.content),
      );
      if (filesToFetch.length === 0) return;

      setLoading(true);
      try {
        const fetchedFiles = await Promise.all(
          filesToFetch.map(fetchFileContent),
        );
        setSelectedFiles((prev) => {
          const next = [...prev];
          fetchedFiles.forEach((f) => {
            const idx = next.findIndex((nf) => nf.path === f.path);
            if (idx >= 0) next[idx] = f;
            else next.push(f);
          });
          return next;
        });
      } catch {
        alert("Erro ao carregar conteúdo de alguns arquivos.");
      } finally {
        setLoading(false);
      }
    } else {
      const pathsToRemove = new Set(allFileNodes.map((f) => f.path));
      setSelectedFiles((prev) => prev.filter((f) => !pathsToRemove.has(f.path)));
    }
  }

  async function handleSelectAll() {
    if (!selectedFolder) return;

    const allFiles: FileNode[] = [];
    function traverse(node: FileNode) {
      if (node.type === "file") allFiles.push(node);
      else if (node.children) node.children.forEach(traverse);
    }
    traverse(selectedFolder);
    if (allFiles.length === 0) return;

    setLoading(true);
    try {
      const filesToFetch = allFiles.filter(
        (f) => !selectedFiles.find((sf) => sf.path === f.path && sf.content),
      );

      const fetchedFiles = await Promise.all(
        filesToFetch.map(fetchFileContent),
      );

      setSelectedFiles((prev) => {
        const next = [...prev];
        allFiles.forEach((file) => {
          const fetched = fetchedFiles.find((ff) => ff.path === file.path);
          const existsIdx = next.findIndex((nf) => nf.path === file.path);
          if (fetched) {
            if (existsIdx >= 0) next[existsIdx] = fetched;
            else next.push(fetched);
          } else if (existsIdx < 0) {
            next.push(file);
          }
        });
        return next;
      });
    } catch {
      alert("Erro ao carregar conteúdo de alguns arquivos.");
    } finally {
      setLoading(false);
    }
  }

  function handleClearAll() {
    setSelectedFiles([]);
  }

  return {
    loading,
    tree,
    selectedFolder,
    setSelectedFolder,
    selectedFiles,
    selectedPaths,
    rootFolders,
    handleScan,
    handleFileSelect,
    handleFolderToggle,
    handleSelectAll,
    handleClearAll,
  };
}
