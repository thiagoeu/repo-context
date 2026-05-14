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
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null);

  // ESTADO DE MÚLTIPLOS ARQUIVOS
  const [selectedFiles, setSelectedFiles] = useState<FileNode[]>([]);

  // Memo para extrair apenas os paths para o FileTree
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
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(node: FileNode) {
    if (node.type === "folder") return;

    // Se já estiver selecionado, removemos da lista
    if (selectedPaths.includes(node.path)) {
      setSelectedFiles((prev) => prev.filter((f) => f.path !== node.path));
      return;
    }

    // Se não estiver, buscamos o conteúdo e adicionamos à lista
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
    } catch (error: any) {
      console.error("Erro ao ler arquivo:", error);
      alert("Não foi possível ler o arquivo.");
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
      // Filtramos arquivos que já temos o conteúdo para evitar re-fetch desnecessário
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

      // Combinamos com os arquivos que já tínhamos selecionados ou que já tinham conteúdo
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
            // Se não precisou de fetch mas não estava na lista, adicionamos o objeto do allFiles
            // (assumindo que ele já tinha conteúdo ou será preenchido)
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

        <div className="mt-6 grid h-[600px] grid-cols-1 gap-6 md:grid-cols-2">
          {/* FileExplorer agora precisa conhecer os paths selecionados */}
          <FileExplorer
            selectedFolder={selectedFolder}
            onFileSelect={handleFileSelect}
            selectedPaths={selectedPaths}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />

          {/* PromptPreview agora recebe a lista completa de objetos selecionados */}
          <PromptPreview selectedFiles={selectedFiles} />
        </div>
      </div>
    </main>
  );
}
