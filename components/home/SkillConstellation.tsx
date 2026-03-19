"use client";

import { useEffect, useRef, useCallback } from "react";
import { CONSTELLATION_DATA } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConstellationNode {
  label: string;
  bx: number;
  by: number;
  x: number;
  y: number;
  r: number;
  color: string;
  level: number;
  parentIdx: number;
  phase: number;
  driftAx: number;
  driftAy: number;
  driftPeriod: number;
}

interface CrossLink {
  fromLabel: string;
  toLabel: string;
}

interface Props {
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  cyan: "#00f0ff",
  purple: "#b829dd",
  green: "#39ff14",
  yellow: "#fff01f",
  pink: "#ff2d95",
  orange: "#ff6b35",
};

const CROSS_LINKS: CrossLink[] = [
  { fromLabel: "Python", toLabel: "Pandas" },
  { fromLabel: "Python", toLabel: "scikit-learn" },
  { fromLabel: "TypeScript", toLabel: "React" },
  { fromLabel: "TypeScript", toLabel: "Next.js" },
  { fromLabel: "Rust", toLabel: "Tokio" },
  { fromLabel: "Go", toLabel: "Go Modules" },
  { fromLabel: "Docker", toLabel: "Kubernetes" },
  { fromLabel: "React", toLabel: "Next.js" },
  { fromLabel: "FastAPI", toLabel: "Pydantic" },
  { fromLabel: "AWS", toLabel: "Terraform" },
  { fromLabel: "FAISS", toLabel: "Vector Search" },
  { fromLabel: "Ollama", toLabel: "RAG" },
];

// ---------------------------------------------------------------------------
// Seeded PRNG
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Build nodes — spread out, staggered 2-row layout
// ---------------------------------------------------------------------------

function buildNodes(): ConstellationNode[] {
  const rng = mulberry32(42);
  const nodes: ConstellationNode[] = [];

  // Staggered 2-row layout:
  // Top row:    3 categories spread wide, centered around y=0.28
  // Bottom row: 3 categories offset/staggered, centered around y=0.72
  const categoryRegions: { cx: number; cy: number }[] = [
    { cx: 0.12, cy: 0.28 }, // Languages — top-left
    { cx: 0.48, cy: 0.2 }, // AI/ML — top-center (slightly higher)
    { cx: 0.85, cy: 0.3 }, // Cloud & Infra — top-right (slightly lower)
    { cx: 0.25, cy: 0.7 }, // Backend — bottom-left (offset from top)
    { cx: 0.6, cy: 0.75 }, // Frontend — bottom-center-right
    { cx: 0.9, cy: 0.65 }, // Systems — bottom-right (higher)
  ];

  const categories = Object.entries(CONSTELLATION_DATA);

  categories.forEach(([catName, catData], catIdx) => {
    const region = categoryRegions[catIdx % categoryRegions.length];
    const color = COLOR_MAP[catData.color] ?? "#00f0ff";

    // Level 0: Category node
    const catNodeIdx = nodes.length;
    nodes.push({
      label: catName,
      bx: region.cx,
      by: region.cy,
      x: 0,
      y: 0,
      r: 15 + rng() * 3,
      color,
      level: 0,
      parentIdx: -1,
      phase: rng() * Math.PI * 2,
      driftAx: 1.5 + rng() * 1,
      driftAy: 1.5 + rng() * 1,
      driftPeriod: 5000 + rng() * 3000,
    });

    // Level 1: Subcategory nodes — SPREAD OUT more from parent
    const subCount = catData.subcategories.length;
    catData.subcategories.forEach((sub, subIdx) => {
      const subAngle = ((Math.PI * 2) / subCount) * subIdx + rng() * 0.5 - 0.25;
      const subDist = 0.07 + rng() * 0.03; // wider orbit: was 0.04

      const subNodeIdx = nodes.length;
      nodes.push({
        label: sub.name,
        bx: region.cx + Math.cos(subAngle) * subDist,
        by: region.cy + Math.sin(subAngle) * subDist,
        x: 0,
        y: 0,
        r: 8 + rng() * 3,
        color,
        level: 1,
        parentIdx: catNodeIdx,
        phase: rng() * Math.PI * 2,
        driftAx: 1 + rng() * 1.5,
        driftAy: 1 + rng() * 1.5,
        driftPeriod: 3500 + rng() * 3000,
      });

      // Level 2: Leaf items — spread away from subcategory
      sub.items.forEach((item, itemIdx) => {
        const spread = sub.items.length > 1 ? (itemIdx / (sub.items.length - 1)) * 1.2 - 0.6 : 0;
        const leafAngle = subAngle + spread + rng() * 0.3;
        const leafDist = subDist + 0.04 + rng() * 0.03; // wider: was 0.025

        nodes.push({
          label: item.name,
          bx: region.cx + Math.cos(leafAngle) * leafDist,
          by: region.cy + Math.sin(leafAngle) * leafDist,
          x: 0,
          y: 0,
          r: 4 + rng() * 5,
          color,
          level: 2,
          parentIdx: subNodeIdx,
          phase: rng() * Math.PI * 2,
          driftAx: 0.8 + rng() * 1.5,
          driftAy: 0.8 + rng() * 1.5,
          driftPeriod: 3000 + rng() * 3000,
        });
      });
    });
  });

  return nodes;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SkillConstellation({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<ConstellationNode[]>(buildNodes());
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = parent.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    handleResize();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const nodes = nodesRef.current;

    const labelToIdx = new Map<string, number>();
    nodes.forEach((n, i) => labelToIdx.set(n.label, i));

    const resolvedCrossLinks: [number, number][] = [];
    for (const link of CROSS_LINKS) {
      const from = labelToIdx.get(link.fromLabel);
      const to = labelToIdx.get(link.toLabel);
      if (from !== undefined && to !== undefined) {
        resolvedCrossLinks.push([from, to]);
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = null;
    };

    if (!isMobile) {
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    const debouncedResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(handleResize, 200);
    };
    window.addEventListener("resize", debouncedResize);

    function cssWidth() {
      return canvas!.width / (window.devicePixelRatio || 1);
    }
    function cssHeight() {
      return canvas!.height / (window.devicePixelRatio || 1);
    }

    function resolvePositions(t: number) {
      const w = cssWidth();
      const h = cssHeight();
      const mouse = mouseRef.current;

      let px = 0;
      let py = 0;
      if (mouse && !isMobile && !prefersReduced) {
        px = -((mouse.x - w / 2) / w) * 6;
        py = -((mouse.y - h / 2) / h) * 6;
      }

      for (const node of nodes) {
        let x = node.bx * w;
        let y = node.by * h;

        if (!prefersReduced && !isMobile) {
          const driftX = Math.sin((t / node.driftPeriod) * Math.PI * 2 + node.phase) * node.driftAx;
          const driftY =
            Math.cos((t / node.driftPeriod) * Math.PI * 2 + node.phase * 1.3) * node.driftAy;
          x += driftX;
          y += driftY;

          if (mouse) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0.1) {
              const force = ((120 - dist) / 120) * 0.12;
              x += dx * force;
              y += dy * force;
            }
          }

          x += px;
          y += py;
        }

        node.x = x;
        node.y = y;
      }
    }

    function getAncestors(nodeIdx: number): number[] {
      const result: number[] = [];
      let idx = nodeIdx;
      while (idx >= 0) {
        result.push(idx);
        idx = nodes[idx].parentIdx;
      }
      return result;
    }

    function getDescendants(nodeIdx: number): number[] {
      const result: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (i === nodeIdx) continue;
        let idx = nodes[i].parentIdx;
        while (idx >= 0) {
          if (idx === nodeIdx) {
            result.push(i);
            break;
          }
          idx = nodes[idx].parentIdx;
        }
      }
      return result;
    }

    function draw() {
      const w = cssWidth();
      const h = cssHeight();
      ctx!.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;

      let hoveredIdx = -1;
      if (mouse && !isMobile) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const hitR = Math.max(n.r + 3, 8);
          if (dx * dx + dy * dy < hitR * hitR) {
            hoveredIdx = i;
            break;
          }
        }
      }

      const highlightSet = new Set<number>();
      if (hoveredIdx >= 0) {
        for (const idx of getAncestors(hoveredIdx)) highlightSet.add(idx);
        for (const idx of getDescendants(hoveredIdx)) highlightSet.add(idx);
        const parentIdx = nodes[hoveredIdx].parentIdx;
        if (parentIdx >= 0) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].parentIdx === parentIdx) highlightSet.add(i);
          }
        }
        for (const [from, to] of resolvedCrossLinks) {
          if (highlightSet.has(from)) highlightSet.add(to);
          if (highlightSet.has(to)) highlightSet.add(from);
        }
      }

      // --- Tree connection lines ---
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.parentIdx < 0) continue;
        const parent = nodes[node.parentIdx];
        const isHighlighted = highlightSet.has(i) && highlightSet.has(node.parentIdx);

        ctx!.beginPath();
        ctx!.moveTo(parent.x, parent.y);
        ctx!.lineTo(node.x, node.y);
        ctx!.strokeStyle = isHighlighted
          ? hexWithAlpha(node.color, 0.3)
          : hexWithAlpha(node.color, node.level === 1 ? 0.08 : 0.05);
        ctx!.lineWidth = isHighlighted ? 1 : 0.4;
        ctx!.stroke();
      }

      // --- Cross-cluster lines (subtle, dashed) ---
      for (const [fromIdx, toIdx] of resolvedCrossLinks) {
        const a = nodes[fromIdx];
        const b = nodes[toIdx];
        const isHighlighted = highlightSet.has(fromIdx) && highlightSet.has(toIdx);

        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = isHighlighted
          ? hexWithAlpha("#ffffff", 0.12)
          : hexWithAlpha("#ffffff", 0.015);
        ctx!.lineWidth = isHighlighted ? 0.6 : 0.2;
        ctx!.setLineDash(isHighlighted ? [2, 3] : [2, 5]);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }

      // --- Nodes ---
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = i === hoveredIdx;
        const isInHighlight = highlightSet.has(i);

        let fillAlpha: number, strokeAlpha: number, strokeWidth: number;

        if (isHovered) {
          fillAlpha = 0.25;
          strokeAlpha = 0.9;
          strokeWidth = 2;
        } else if (isInHighlight) {
          fillAlpha = 0.15;
          strokeAlpha = 0.65;
          strokeWidth = 1.2;
        } else if (node.level === 0) {
          fillAlpha = 0.06;
          strokeAlpha = 0.3;
          strokeWidth = 1;
        } else if (node.level === 1) {
          fillAlpha = 0.04;
          strokeAlpha = 0.18;
          strokeWidth = 0.6;
        } else {
          fillAlpha = 0.03;
          strokeAlpha = 0.14;
          strokeWidth = 0.4;
        }

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx!.fillStyle = hexWithAlpha(node.color, fillAlpha);
        ctx!.fill();
        ctx!.strokeStyle = hexWithAlpha(node.color, strokeAlpha);
        ctx!.lineWidth = strokeWidth;
        ctx!.stroke();

        if (isHovered) {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
          ctx!.strokeStyle = hexWithAlpha(node.color, 0.2);
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        // Labels: category always, subcategory + leaf only on highlight
        const showLabel = node.level === 0 || isInHighlight;
        if (showLabel) {
          const fontSize = node.level === 0 ? 10 : node.level === 1 ? 8 : 7;
          const bold = isHovered || (isInHighlight && node.level === 0);
          ctx!.font = `${bold ? "bold " : ""}${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;

          let labelAlpha: number;
          if (isHovered) labelAlpha = 0.95;
          else if (isInHighlight) labelAlpha = 0.7;
          else if (node.level === 0) labelAlpha = 0.5;
          else labelAlpha = 0.35;

          ctx!.fillStyle = hexWithAlpha("#f7f7f8", labelAlpha);
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(node.label, node.x, node.y + node.r + fontSize + 1);
        }
      }
    }

    if (prefersReduced || isMobile) {
      resolvePositions(0);
      draw();
    } else {
      const loop = (t: number) => {
        resolvePositions(t);
        draw();
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", debouncedResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, [handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
