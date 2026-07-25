"use client";

import { useState } from "react";
import { FolderTabs, PromptPreview, SearchBar, FileExplorer } from "@/components";
import { useFileExplorer } from "@/features/file-explorer";
import { GraphPanel } from "@/features/code-graph";
import { GitBranch, FileText } from "lucide-react";

type MainTab = "prompt" | "graph";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("prompt");

  const {
    loading,
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
  } = useFileExplorer();

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

        {/* Tabs de modo */}
        <div className="mt-6 flex items-center gap-1 border-b border-zinc-800 pb-0">
          <button
            onClick={() => setActiveTab("prompt")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "prompt"
                ? "border-zinc-100 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileText size={14} />
            Prompt Preview
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "graph"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <GitBranch size={14} />
            Code Graph
            {selectedFiles.length > 0 && (
              <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
                {selectedFiles.filter((f) => f.content).length}
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 grid h-[calc(100vh-360px)] min-h-[28rem] grid-cols-1 gap-6 md:grid-cols-2">
          <FileExplorer
            selectedFolder={selectedFolder}
            onFileSelect={handleFileSelect}
            onFolderToggle={handleFolderToggle}
            selectedPaths={selectedPaths}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />

          <div className="min-h-0 h-full">
            {activeTab === "prompt" && (
              <PromptPreview
                selectedFiles={selectedFiles}
                selectedFolder={selectedFolder}
              />
            )}
            {activeTab === "graph" && (
              <GraphPanel selectedFiles={selectedFiles} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
