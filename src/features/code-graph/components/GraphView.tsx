"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { GraphData, GraphNode, GraphEdge } from "@/agents/graph/tools";

interface GraphViewProps {
  data: GraphData;
}

// Paleta de cores por tipo de nó
const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  component: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  hook: { bg: "#2d1b69", border: "#8b5cf6", text: "#c4b5fd" },
  function: { bg: "#1a3a2a", border: "#22c55e", text: "#86efac" },
  class: { bg: "#4a1942", border: "#ec4899", text: "#f9a8d4" },
  method: { bg: "#1e3a5f", border: "#06b6d4", text: "#67e8f9" },
  export: { bg: "#3a2e14", border: "#f59e0b", text: "#fcd34d" },
};

const DEFAULT_COLOR = { bg: "#1c1c1c", border: "#52525b", text: "#a1a1aa" };

const NODE_WIDTH = 160;
const NODE_HEIGHT = 48;
const PADDING_X = 60;
const PADDING_Y = 60;

interface LayoutNode extends GraphNode {
  x: number;
  y: number;
}

/** Layout automático simples: agrupa por arquivo em colunas */
function computeLayout(nodes: GraphNode[]): LayoutNode[] {
  const fileGroups = new Map<string, GraphNode[]>();
  for (const node of nodes) {
    const group = fileGroups.get(node.file) || [];
    group.push(node);
    fileGroups.set(node.file, group);
  }

  const layoutNodes: LayoutNode[] = [];
  let colX = PADDING_X;

  for (const [, group] of fileGroups) {
    let rowY = PADDING_Y;
    for (const node of group) {
      layoutNodes.push({ ...node, x: colX, y: rowY });
      rowY += NODE_HEIGHT + PADDING_Y;
    }
    colX += NODE_WIDTH + PADDING_X * 2;
  }

  return layoutNodes;
}

export default function GraphView({ data }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const layoutNodes = computeLayout(data.nodes);
  const nodeMap = new Map(layoutNodes.map((n) => [n.id, n]));

  // Tamanho total do canvas
  const canvasW = Math.max(...layoutNodes.map((n) => n.x + NODE_WIDTH + PADDING_X), 800);
  const canvasH = Math.max(...layoutNodes.map((n) => n.y + NODE_HEIGHT + PADDING_Y), 400);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.2, Math.min(3, prev.scale * delta)),
    }));
  }, []);

  function resetView() {
    setTransform({ x: 0, y: 0, scale: 1 });
  }

  function getEdgePath(edge: GraphEdge): string | null {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from || !to) return null;

    const x1 = from.x + NODE_WIDTH / 2;
    const y1 = from.y + NODE_HEIGHT;
    const x2 = to.x + NODE_WIDTH / 2;
    const y2 = to.y;

    // Bezier curve
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  }

  if (data.nodes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
        <span className="text-4xl">🕸️</span>
        <p className="text-sm italic">Nenhum nó encontrado nos arquivos selecionados</p>
      </div>
    );
  }

  // Group nodes by file for cluster backgrounds
  const fileGroups = new Map<string, LayoutNode[]>();
  for (const node of layoutNodes) {
    const group = fileGroups.get(node.file) || [];
    group.push(node);
    fileGroups.set(node.file, group);
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={resetView}
          className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[10px] font-bold text-zinc-400 backdrop-blur-sm transition hover:bg-zinc-700 hover:text-zinc-200"
        >
          ↺ Reset
        </button>
        <span className="rounded-md border border-zinc-700/50 bg-zinc-900/80 px-2 py-1 text-[10px] text-zinc-500 backdrop-blur-sm">
          {Math.round(transform.scale * 100)}%
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
        {Object.entries(NODE_COLORS).map(([type, colors]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-bold uppercase backdrop-blur-sm"
            style={{ borderColor: colors.border, backgroundColor: colors.bg + "cc", color: colors.text }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
            {type}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <span className="rounded-md border border-zinc-700/50 bg-zinc-900/80 px-2 py-1 text-[10px] text-zinc-400 backdrop-blur-sm">
          {data.nodes.length} nós · {data.edges.length} arestas
        </span>
      </div>

      {/* SVG */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
          </marker>
          <marker
            id="arrowhead-hover"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Cluster backgrounds */}
          {Array.from(fileGroups.entries()).map(([file, nodes]) => {
            const minX = Math.min(...nodes.map((n) => n.x)) - 16;
            const minY = Math.min(...nodes.map((n) => n.y)) - 32;
            const maxX = Math.max(...nodes.map((n) => n.x + NODE_WIDTH)) + 16;
            const maxY = Math.max(...nodes.map((n) => n.y + NODE_HEIGHT)) + 16;

            return (
              <g key={file}>
                <rect
                  x={minX}
                  y={minY}
                  width={maxX - minX}
                  height={maxY - minY}
                  rx={10}
                  ry={10}
                  fill="#18181b"
                  stroke="#27272a"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={minX + 10}
                  y={minY + 18}
                  fontSize={10}
                  fill="#52525b"
                  fontFamily="monospace"
                >
                  {file}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {data.edges.map((edge, i) => {
            const path = getEdgePath(edge);
            if (!path) return null;

            const isRelated =
              hoveredNode === edge.from || hoveredNode === edge.to;
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;

            // Label position (midpoint of curve)
            const lx = (fromNode.x + NODE_WIDTH / 2 + toNode.x + NODE_WIDTH / 2) / 2;
            const ly = (fromNode.y + NODE_HEIGHT + toNode.y) / 2;

            return (
              <g key={i}>
                <path
                  d={path}
                  fill="none"
                  stroke={isRelated ? "#3b82f6" : "#3f3f46"}
                  strokeWidth={isRelated ? 2 : 1}
                  strokeDasharray={edge.label === "importa" ? "5 3" : undefined}
                  markerEnd={isRelated ? "url(#arrowhead-hover)" : "url(#arrowhead)"}
                  style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                />
                {isRelated && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#3b82f6"
                    fontFamily="monospace"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {layoutNodes.map((node) => {
            const colors = NODE_COLORS[node.type] || DEFAULT_COLOR;
            const isHovered = hoveredNode === node.id;
            const isRelated =
              hoveredNode !== null &&
              data.edges.some(
                (e) =>
                  (e.from === hoveredNode && e.to === node.id) ||
                  (e.to === hoveredNode && e.from === node.id),
              );

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                onMouseEnter={(e) => {
                  setHoveredNode(node.id);
                  const svgRect = svgRef.current?.getBoundingClientRect();
                  if (svgRect) {
                    setTooltip({
                      x: e.clientX - svgRect.left,
                      y: e.clientY - svgRect.top - 40,
                      text: `${node.type}: ${node.label}`,
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setTooltip(null);
                }}
                style={{ cursor: "default" }}
              >
                {/* Shadow/glow */}
                {(isHovered || isRelated) && (
                  <rect
                    x={-3}
                    y={-3}
                    width={NODE_WIDTH + 6}
                    height={NODE_HEIGHT + 6}
                    rx={9}
                    ry={9}
                    fill="none"
                    stroke={colors.border}
                    strokeWidth={2}
                    opacity={0.4}
                  />
                )}

                {/* Node background */}
                <rect
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={6}
                  ry={6}
                  fill={isHovered ? colors.bg + "ff" : colors.bg + "cc"}
                  stroke={isHovered || isRelated ? colors.border : colors.border + "80"}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ transition: "fill 0.2s, stroke 0.2s" }}
                />

                {/* Type badge */}
                <rect
                  x={6}
                  y={6}
                  width={40}
                  height={14}
                  rx={3}
                  ry={3}
                  fill={colors.border + "30"}
                />
                <text
                  x={26}
                  y={16}
                  textAnchor="middle"
                  fontSize={8}
                  fill={colors.border}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.type.toUpperCase().slice(0, 4)}
                </text>

                {/* Label */}
                <text
                  x={NODE_WIDTH / 2}
                  y={NODE_HEIGHT - 13}
                  textAnchor="middle"
                  fontSize={11}
                  fill={isHovered ? "#ffffff" : colors.text}
                  fontFamily="monospace"
                  fontWeight={isHovered ? "bold" : "normal"}
                  style={{ transition: "fill 0.2s" }}
                >
                  {node.label.length > 16
                    ? node.label.slice(0, 14) + "…"
                    : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-[11px] font-mono text-zinc-200 shadow-xl"
          style={{ left: tooltip.x + 12, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-3 right-3 z-10 text-[9px] text-zinc-600">
        Scroll para zoom · Arraste para mover
      </div>
    </div>
  );
}
