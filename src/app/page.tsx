"use client";

import { useMemo, useState } from "react";
import {
  FolderTabs,
  PromptPreview,
  SearchBar,
  FileExplorer,
} from "@/components";
import { FileNode } from "@/types/fileNode";

export default function Home() {
  const [documentation, setDocumentation] = useState<string>("");
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileNode[]>([]);

  const selectedPaths = useMemo(
    () => selectedFiles.map((f) => f.path),
    [selectedFiles],
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
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(node: FileNode) {
    if (node.type === "folder") return;

    if (selectedPaths.includes(node.path)) {
      setSelectedFiles((prev) => prev.filter((f) => f.path !== node.path));
      return;
    }

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: node.path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const fileWithContent = { ...node, content: data.content };
      setSelectedFiles((prev) => [...prev, fileWithContent]);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      alert("Não foi possível ler o arquivo.");
    }
  }

  // Função que manipula o toggle do checkbox da pasta
  async function handleFolderToggle(folderNode: FileNode, checked: boolean) {
    // Coleta todos os arquivos (nós do tipo file) dentro da pasta (recursivamente)
    const allFileNodes: FileNode[] = [];
    function collect(node: FileNode) {
      if (node.type === "file") {
        allFileNodes.push(node);
      } else if (node.children) {
        node.children.forEach(collect);
      }
    }
    collect(folderNode);

    if (checked) {
      // Selecionar todos os arquivos da pasta
      // Filtra os arquivos que já estão selecionados com conteúdo
      const filesToFetch = allFileNodes.filter(
        (f) => !selectedFiles.some((sf) => sf.path === f.path && sf.content),
      );

      if (filesToFetch.length === 0) {
        // Se todos já estão selecionados, não faz nada
        return;
      }

      setLoading(true);
      try {
        const fetchedFiles = await Promise.all(
          filesToFetch.map(async (file) => {
            const response = await fetch("/api/file", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filePath: file.path }),
            });
            const data = await response.json();
            return { ...file, content: data.content };
          }),
        );

        setSelectedFiles((prev) => {
          const novos = [...prev];
          // Adiciona os arquivos buscados
          fetchedFiles.forEach((f) => {
            const exists = novos.find((nf) => nf.path === f.path);
            if (exists) {
              exists.content = f.content;
            } else {
              novos.push(f);
            }
          });
          // Adiciona os arquivos que já estavam selecionados (com conteúdo) e que não foram buscados
          allFileNodes.forEach((f) => {
            if (!novos.find((nf) => nf.path === f.path)) {
              const existing = prev.find((p) => p.path === f.path);
              if (existing && existing.content) {
                novos.push(existing);
              } else {
                // Caso raro: se não tem conteúdo, buscamos? Mas teoricamente todos os que faltavam foram buscados.
                console.warn("Arquivo sem conteúdo:", f.path);
              }
            }
          });
          return novos;
        });
      } catch (error) {
        console.error("Erro ao selecionar todos da pasta:", error);
        alert("Erro ao carregar conteúdo de alguns arquivos.");
      } finally {
        setLoading(false);
      }
    } else {
      // Desmarcar: remover todos os arquivos da pasta
      const pathsToRemove = new Set(allFileNodes.map((f) => f.path));
      setSelectedFiles((prev) =>
        prev.filter((f) => !pathsToRemove.has(f.path)),
      );
    }
  }

  function handleClearAll() {
    setSelectedFiles([]);
  }

  async function handleSelectAll() {
    if (!selectedFolder) return;

    const allFiles: FileNode[] = [];
    function traverse(node: FileNode) {
      if (node.type === "file") {
        allFiles.push(node);
      } else if (node.children) {
        node.children.forEach(traverse);
      }
    }
    traverse(selectedFolder);

    if (allFiles.length === 0) return;

    setLoading(true);
    try {
      const filesToFetch = allFiles.filter(
        (f) => !selectedFiles.find((sf) => sf.path === f.path && sf.content),
      );

      const fetchedFiles = await Promise.all(
        filesToFetch.map(async (file) => {
          const response = await fetch("/api/file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: file.path }),
          });
          const data = await response.json();
          return { ...file, content: data.content };
        }),
      );

      setSelectedFiles((prev) => {
        const newFiles = [...prev];
        allFiles.forEach((file) => {
          const fetched = fetchedFiles.find((ff) => ff.path === file.path);
          const alreadyExists = newFiles.find((nf) => nf.path === file.path);

          if (fetched) {
            if (alreadyExists) {
              alreadyExists.content = fetched.content;
            } else {
              newFiles.push(fetched);
            }
          } else if (!alreadyExists) {
            newFiles.push(file);
          }
        });
        return newFiles;
      });
    } catch (error) {
      console.error("Erro ao selecionar todos:", error);
      alert("Erro ao carregar conteúdo de alguns arquivos.");
    } finally {
      setLoading(false);
    }
  }

  const rootFolders = useMemo(() => {
    return tree.filter((node) => node.type === "folder");
  }, [tree]);

  return (
    <main className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold">RepoContext</h1>
        <SearchBar onScan={handleScan} isLoading={loading} />

        <FolderTabs
          folders={rootFolders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />

        <div className="mt-6 grid h-[calc(100vh-320px)] min-h-125 grid-cols-1 gap-6 md:grid-cols-2">
          <FileExplorer
            selectedFolder={selectedFolder}
            onFileSelect={handleFileSelect}
            onFolderToggle={handleFolderToggle} // <-- NOVA PROP
            selectedPaths={selectedPaths}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />

          <PromptPreview
            selectedFiles={selectedFiles}
            selectedFolder={selectedFolder}
          />
        </div>
      </div>
    </main>
  );
}
