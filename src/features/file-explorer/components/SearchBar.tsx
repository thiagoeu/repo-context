"use client";

import { useEffect, useState } from "react";

interface SearchBarProps {
  onScan: (path: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onScan, isLoading }: SearchBarProps) {
  const [path, setPath] = useState("C:\\workspace\\RepoContext");

  useEffect(() => {
    const savedPath = localStorage.getItem("repo-path");
    if (savedPath) {
      setPath(savedPath);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("repo-path", path);
  }, [path]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onScan(path);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 transition-colors outline-none focus:border-zinc-600"
      />

      <button
        onClick={() => onScan(path)}
        disabled={isLoading || !path.trim()}
        className="rounded-lg bg-zinc-100 px-5 py-2 font-medium text-zinc-950 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Scanning..." : "Scan"}
      </button>
    </div>
  );
}
