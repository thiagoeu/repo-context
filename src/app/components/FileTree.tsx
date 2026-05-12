"use client";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface Props {
  nodes: FileNode[];
}

export default function FileTree({ nodes }: Props) {
  if (!Array.isArray(nodes)) {
    return null;
  }

  return (
    <div className="font-mono text-sm text-zinc-200">
      {nodes.map((node, index) => (
        <TreeNode
          key={node.path}
          node={node}
          prefix=""
          isLast={index === nodes.length - 1}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  prefix,
  isLast,
}: {
  node: FileNode;
  prefix: string;
  isLast: boolean;
}) {
  const connector = isLast ? "┗ " : "┣ ";
  const childPrefix = prefix + (isLast ? "  " : "┃ ");

  return (
    <div>
      <div className="whitespace-pre">
        {prefix}
        {connector}
        {node.type === "folder" ? "📁 " : "📄 "}
        {node.name}
      </div>

      {node.children?.map((child, index) => (
        <TreeNode
          key={child.path}
          node={child}
          prefix={childPrefix}
          isLast={index === node.children!.length - 1}
        />
      ))}
    </div>
  );
}
