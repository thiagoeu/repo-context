"use client";

import { useState } from "react";

import FileTree from "@/components/FileTree";
import { treeToText } from "@/app/utils/treeToText";

export default function Home() {
  const [path, setPath] = useState("");
  const [tree, setTree] = useState([]);

  async function handleScan() {
    if (!path.trim()) {
      alert("Digite um caminho");
      return;
    }

    const response = await fetch("/api/tree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dirPath: path,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert(data.error || "Erro");
      return;
    }

    setTree(data);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">RepoContext</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="C:/projects/my-app"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="border px-3 py-2 w-full"
        />

        <button onClick={handleScan} className="bg-black text-white px-4">
          Scan
        </button>
      </div>

      <div className="mt-6">
        <FileTree nodes={tree} />
      </div>

      <pre className="mt-4 p-4 bg-zinc-950 text-zinc-100 rounded overflow-auto text-sm font-mono">
        {treeToText(tree)}
      </pre>
    </main>
  );
}
