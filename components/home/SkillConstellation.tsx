"use client";

import { useEffect, useRef, useCallback } from "react";
import { CONSTELLATION_DATA } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConstellationNode {
  label: string;
  // Base position as fraction of canvas (0-1)
  bx: number;
  by: number;
  // Pixel offsets from base (applied after converting bx/by to pixels)
  ox: number;
  oy: number;
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

const CROSS_LINKS = [
  ["Python", "Pandas"],
  ["Python", "scikit-learn"],
  ["TypeScript", "React"],
  ["TypeScript", "Next.js"],
  ["Rust", "Tokio"],
  ["Go", "Go Modules"],
  ["Docker", "Kubernetes"],
  ["React", "Next.js"],
  ["FastAPI", "Pydantic"],
  ["AWS", "Terraform"],
  ["FAISS", "Vector Search"],
  ["Ollama", "RAG"],
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
// Build nodes — pixel-offset based for consistent spacing
// ---------------------------------------------------------------------------

function buildNodes(): ConstellationNode[] {
  const rng = mulberry32(42);
  const nodes: ConstellationNode[] = [];

  // Canvas is full viewport. Categories occupy the right 60% (x: 0.4-0.92)
  // and full height with padding (y: 0.12-0.82). Staggered 2-row layout.
  const regions = [
    { cx: 0.42, cy: 0.2 }, // Languages
    { cx: 0.65, cy: 0.14 }, // AI/ML
    { cx: 0.88, cy: 0.22 }, // Cloud & Infra
    { cx: 0.48, cy: 0.62 }, // Backend
    { cx: 0.7, cy: 0.7 }, // Frontend
    { cx: 0.9, cy: 0.58 }, // Systems
  ];

  // Orbital distances in PIXELS — consistent visual spacing
  const SUB_DIST = 80; // subcategory: 60-100px from parent
  const LEAF_DIST = 50; // leaf: 35-65px further from subcategory

  Object.entries(CONSTELLATION_DATA).forEach(([catName, catData], catIdx) => {
    const region = regions[catIdx % regions.length];
    const color = COLOR_MAP[catData.color] ?? "#00f0ff";

    // Category node — ox/oy = 0 (it's the center)
    const catNodeIdx = nodes.length;
    nodes.push({
      label: catName,
      bx: region.cx,
      by: region.cy,
      ox: 0,
      oy: 0,
      x: 0,
      y: 0,
      r: 14 + rng() * 3,
      color,
      level: 0,
      parentIdx: -1,
      phase: rng() * Math.PI * 2,
      driftAx: 1.5 + rng() * 1,
      driftAy: 1.5 + rng() * 1,
      driftPeriod: 5000 + rng() * 3000,
    });

    // Subcategories — orbit at SUB_DIST pixels
    const subCount = catData.subcategories.length;
    catData.subcategories.forEach((sub, subIdx) => {
      const subAngle = ((Math.PI * 2) / subCount) * subIdx + rng() * 0.5 - 0.25;
      const dist = SUB_DIST - 20 + rng() * 40; // 80-120px

      const subOx = Math.cos(subAngle) * dist;
      const subOy = Math.sin(subAngle) * dist;

      const subNodeIdx = nodes.length;
      nodes.push({
        label: sub.name,
        bx: region.cx,
        by: region.cy,
        ox: subOx,
        oy: subOy,
        x: 0,
        y: 0,
        r: 7 + rng() * 3,
        color,
        level: 1,
        parentIdx: catNodeIdx,
        phase: rng() * Math.PI * 2,
        driftAx: 1 + rng() * 1.5,
        driftAy: 1 + rng() * 1.5,
        driftPeriod: 3500 + rng() * 3000,
      });

      // Leaf items — orbit at LEAF_DIST pixels further out
      sub.items.forEach((item, itemIdx) => {
        const spread = sub.items.length > 1 ? (itemIdx / (sub.items.length - 1)) * 1.2 - 0.6 : 0;
        const leafAngle = subAngle + spread + rng() * 0.25;
        const leafR = dist + LEAF_DIST - 15 + rng() * 30; // total from center

        nodes.push({
          label: item.name,
          bx: region.cx,
          by: region.cy,
          ox: Math.cos(leafAngle) * leafR,
          oy: Math.sin(leafAngle) * leafR,
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

    // Build cross-link index
    const labelToIdx = new Map<string, number>();
    nodes.forEach((n, i) => labelToIdx.set(n.label, i));
    const resolvedCrossLinks: [number, number][] = [];
    for (const [from, to] of CROSS_LINKS) {
      const fi = labelToIdx.get(from);
      const ti = labelToIdx.get(to);
      if (fi !== undefined && ti !== undefined) resolvedCrossLinks.push([fi, ti]);
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

    function cssW() {
      return canvas!.width / (window.devicePixelRatio || 1);
    }
    function cssH() {
      return canvas!.height / (window.devicePixelRatio || 1);
    }

    function resolvePositions(t: number) {
      const w = cssW();
      const h = cssH();
      const mouse = mouseRef.current;

      let px = 0,
        py = 0;
      if (mouse && !isMobile && !prefersReduced) {
        px = -((mouse.x - w / 2) / w) * 6;
        py = -((mouse.y - h / 2) / h) * 6;
      }

      for (const node of nodes) {
        // Base position from fraction + pixel offset
        let x = node.bx * w + node.ox;
        let y = node.by * h + node.oy;

        if (!prefersReduced && !isMobile) {
          x += Math.sin((t / node.driftPeriod) * Math.PI * 2 + node.phase) * node.driftAx;
          y += Math.cos((t / node.driftPeriod) * Math.PI * 2 + node.phase * 1.3) * node.driftAy;

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

    function getFamily(nodeIdx: number): Set<number> {
      const set = new Set<number>();
      // Walk up
      let idx = nodeIdx;
      while (idx >= 0) {
        set.add(idx);
        idx = nodes[idx].parentIdx;
      }
      // Walk down
      for (let i = 0; i < nodes.length; i++) {
        let p = nodes[i].parentIdx;
        while (p >= 0) {
          if (p === nodeIdx) {
            set.add(i);
            break;
          }
          p = nodes[p].parentIdx;
        }
      }
      // Siblings
      const parent = nodes[nodeIdx].parentIdx;
      if (parent >= 0) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].parentIdx === parent) set.add(i);
        }
      }
      // Cross-links
      for (const [from, to] of resolvedCrossLinks) {
        if (set.has(from)) set.add(to);
        if (set.has(to)) set.add(from);
      }
      return set;
    }

    function draw() {
      const w = cssW();
      const h = cssH();
      ctx!.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      // Hover detection
      let hoveredIdx = -1;
      if (mouse && !isMobile) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = mouse.x - n.x,
            dy = mouse.y - n.y;
          const hitR = Math.max(n.r + 3, 8);
          if (dx * dx + dy * dy < hitR * hitR) {
            hoveredIdx = i;
            break;
          }
        }
      }

      const hl = hoveredIdx >= 0 ? getFamily(hoveredIdx) : new Set<number>();

      // Tree lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.parentIdx < 0) continue;
        const p = nodes[n.parentIdx];
        const lit = hl.has(i) && hl.has(n.parentIdx);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(n.x, n.y);
        ctx!.strokeStyle = lit ? hexA(n.color, 0.3) : hexA(n.color, n.level === 1 ? 0.08 : 0.05);
        ctx!.lineWidth = lit ? 1 : 0.4;
        ctx!.stroke();
      }

      // Cross-links
      for (const [fi, ti] of resolvedCrossLinks) {
        const a = nodes[fi],
          b = nodes[ti];
        const lit = hl.has(fi) && hl.has(ti);
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = lit ? hexA("#fff", 0.12) : hexA("#fff", 0.015);
        ctx!.lineWidth = lit ? 0.6 : 0.2;
        ctx!.setLineDash(lit ? [2, 3] : [2, 5]);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const hov = i === hoveredIdx;
        const lit = hl.has(i);

        const fa = hov ? 0.25 : lit ? 0.15 : n.level === 0 ? 0.06 : n.level === 1 ? 0.04 : 0.03;
        const sa = hov ? 0.9 : lit ? 0.65 : n.level === 0 ? 0.3 : n.level === 1 ? 0.18 : 0.14;
        const sw = hov ? 2 : lit ? 1.2 : n.level === 0 ? 1 : n.level === 1 ? 0.6 : 0.4;

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = hexA(n.color, fa);
        ctx!.fill();
        ctx!.strokeStyle = hexA(n.color, sa);
        ctx!.lineWidth = sw;
        ctx!.stroke();

        if (hov) {
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
          ctx!.strokeStyle = hexA(n.color, 0.2);
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        // Labels
        const show = n.level === 0 || lit;
        if (show) {
          const fs = n.level === 0 ? 10 : n.level === 1 ? 8 : 7;
          ctx!.font = `${hov || (lit && n.level === 0) ? "bold " : ""}${fs}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          const la = hov ? 0.95 : lit ? 0.7 : 0.5;
          ctx!.fillStyle = hexA("#f7f7f8", la);
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(n.label, n.x, n.y + n.r + fs + 1);
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

function hexA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
