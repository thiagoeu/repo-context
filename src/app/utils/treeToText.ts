interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}

export function treeToText(nodes: FileNode[], prefix = ""): string {
  let result = "";

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;

    const connector = isLast ? "┗ " : "┣ ";

    result += prefix + connector + node.name + "\n";

    if (node.children && node.children.length > 0) {
      const childPrefix = prefix + (isLast ? "  " : "┃ ");

      result += treeToText(node.children, childPrefix);
    }
  });

  return result;
}
