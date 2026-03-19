"use client";

import { useEffect, useRef, useCallback } from "react";
import { CONSTELLATION_DATA } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConstellationNode {
  label: string;
  /** base x (fraction 0-1 of canvas) */
  bx: number;
  /** base y (fraction 0-1 of canvas) */
  by: number;
  /** current rendered x */
  x: number;
  /** current rendered y */
  y: number;
  /** radius in CSS pixels */
  r: number;
  /** hex colour */
  color: string;
  /** is this a category (group) node? */
  isCategory: boolean;
  /** index of parent category node (-1 for categories themselves) */
  parentIdx: number;
  /** unique phase offset for drift animation */
  phase: number;
  /** drift amplitude x */
  driftAx: number;
  /** drift amplitude y */
  driftAy: number;
  /** drift period (ms) */
  driftPeriod: number;
}

interface Props {
  className?: string;
}

// ---------------------------------------------------------------------------
// Colour map — 6 categories
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, string> = {
  cyan: "#00f0ff",
  purple: "#b829dd",
  green: "#39ff14",
  yellow: "#fff01f",
  pink: "#ff2d95",
  orange: "#ff6b35",
};

// ---------------------------------------------------------------------------
// Seeded PRNG (deterministic layout)
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
// Build node list from CONSTELLATION_DATA
// ---------------------------------------------------------------------------

function buildNodes(): ConstellationNode[] {
  const rng = mulberry32(42);
  const nodes: ConstellationNode[] = [];

  // 6 category regions arranged in a hex-ish pattern for visual appeal
  const categoryRegions: { cx: number; cy: number }[] = [
    { cx: 0.2, cy: 0.22 }, // Languages – top-left
    { cx: 0.75, cy: 0.18 }, // AI/ML – top-right
    { cx: 0.12, cy: 0.6 }, // Cloud & Infra – mid-left
    { cx: 0.82, cy: 0.55 }, // Backend – mid-right
    { cx: 0.35, cy: 0.82 }, // Frontend – bottom-left
    { cx: 0.65, cy: 0.82 }, // Systems – bottom-right
  ];

  const categories = Object.entries(CONSTELLATION_DATA);

  categories.forEach(([catName, catData], catIdx) => {
    const region = categoryRegions[catIdx % categoryRegions.length];
    const color = COLOR_MAP[catData.color] ?? "#00f0ff";

    // Category node (largest)
    const catNodeIdx = nodes.length;
    nodes.push({
      label: catName,
      bx: region.cx + (rng() - 0.5) * 0.04,
      by: region.cy + (rng() - 0.5) * 0.04,
      x: 0,
      y: 0,
      r: 22 + rng() * 4, // 22-26
      color,
      isCategory: true,
      parentIdx: -1,
      phase: rng() * Math.PI * 2,
      driftAx: 2 + rng() * 2,
      driftAy: 2 + rng() * 2,
      driftPeriod: 4000 + rng() * 3000,
    });

    // Item nodes — varied sizes based on weight
    // Arrange items in concentric rings: weight 3 closest, weight 1 farthest
    const sorted = [...catData.items].sort((a, b) => b.weight - a.weight);
    const totalItems = sorted.length;

    sorted.forEach((item, itemIdx) => {
      // Spread items in a spiral-ish pattern
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
      const angle = goldenAngle * itemIdx + rng() * 0.4;

      // Distance from center: heavier items closer, lighter ones orbit farther out
      const ringBase = item.weight === 3 ? 0.05 : item.weight === 2 ? 0.09 : 0.13;
      const dist = ringBase + rng() * 0.04 + (itemIdx / totalItems) * 0.03;

      // Radius based on weight: weight 3 = large, weight 1 = tiny
      const radiusMap = { 3: 12 + rng() * 4, 2: 8 + rng() * 3, 1: 5 + rng() * 2 };
      const r = radiusMap[item.weight as 1 | 2 | 3] ?? 8;

      nodes.push({
        label: item.name,
        bx: region.cx + Math.cos(angle) * dist,
        by: region.cy + Math.sin(angle) * dist,
        x: 0,
        y: 0,
        r,
        color,
        isCategory: false,
        parentIdx: catNodeIdx,
        phase: rng() * Math.PI * 2,
        driftAx: 1 + rng() * 2.5,
        driftAy: 1 + rng() * 2.5,
        driftPeriod: 3000 + rng() * 4000,
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

  // -----------------------------------------------------------------------
  // Resize handler — retina-aware
  // -----------------------------------------------------------------------

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

  // -----------------------------------------------------------------------
  // Main effect
  // -----------------------------------------------------------------------

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

    // -------------------------------------------------------------------
    // Mouse tracking
    // -------------------------------------------------------------------

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

    // -------------------------------------------------------------------
    // Debounced resize
    // -------------------------------------------------------------------

    const debouncedResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(handleResize, 200);
    };
    window.addEventListener("resize", debouncedResize);

    // -------------------------------------------------------------------
    // Drawing helpers
    // -------------------------------------------------------------------

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
        px = -((mouse.x - w / 2) / w) * 8;
        py = -((mouse.y - h / 2) / h) * 8;
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
            if (dist < 150 && dist > 0.1) {
              const force = ((150 - dist) / 150) * 0.15;
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

    function draw() {
      const w = cssWidth();
      const h = cssHeight();
      ctx!.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;

      // Determine hovered node
      let hoveredIdx = -1;
      if (mouse && !isMobile) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          if (dx * dx + dy * dy < (n.r + 4) * (n.r + 4)) {
            hoveredIdx = i;
            break;
          }
        }
      }

      // Connection lines — draw between parent and child nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.parentIdx < 0) continue;
        const parent = nodes[node.parentIdx];

        const isHighlighted =
          hoveredIdx >= 0 &&
          (hoveredIdx === i ||
            hoveredIdx === node.parentIdx ||
            (nodes[hoveredIdx].isCategory && hoveredIdx === node.parentIdx) ||
            (!nodes[hoveredIdx].isCategory && nodes[hoveredIdx].parentIdx === node.parentIdx));

        ctx!.beginPath();
        ctx!.moveTo(parent.x, parent.y);
        ctx!.lineTo(node.x, node.y);
        ctx!.strokeStyle = isHighlighted
          ? hexWithAlpha(node.color, 0.3)
          : hexWithAlpha(node.color, 0.05);
        ctx!.lineWidth = isHighlighted ? 1 : 0.4;
        ctx!.stroke();
      }

      // Also draw faint inter-category lines between nearby category nodes
      const catNodes = nodes.filter((n) => n.isCategory);
      for (let i = 0; i < catNodes.length; i++) {
        for (let j = i + 1; j < catNodes.length; j++) {
          const a = catNodes[i];
          const b = catNodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = hexWithAlpha("#ffffff", 0.02);
            ctx!.lineWidth = 0.3;
            ctx!.stroke();
          }
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = i === hoveredIdx;
        const isRelated =
          hoveredIdx >= 0 &&
          (nodes[hoveredIdx].parentIdx === i ||
            (node.parentIdx >= 0 && node.parentIdx === nodes[hoveredIdx].parentIdx) ||
            (nodes[hoveredIdx].isCategory && node.parentIdx === hoveredIdx));

        const highlight = isHovered || isRelated;

        // Circle fill
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx!.fillStyle = hexWithAlpha(node.color, highlight ? 0.2 : node.isCategory ? 0.08 : 0.04);
        ctx!.fill();

        // Circle stroke
        ctx!.strokeStyle = hexWithAlpha(
          node.color,
          highlight ? 0.85 : node.isCategory ? 0.4 : node.r > 10 ? 0.2 : 0.12
        );
        ctx!.lineWidth = highlight ? 1.8 : node.isCategory ? 1.2 : node.r > 10 ? 0.8 : 0.5;
        ctx!.stroke();

        // Glow on hover
        if (isHovered) {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.r + 5, 0, Math.PI * 2);
          ctx!.strokeStyle = hexWithAlpha(node.color, 0.2);
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        // Label — only show for category nodes and large items (weight 2-3) by default
        // Show all labels when hovering a cluster
        const showLabel = node.isCategory || node.r >= 8 || highlight;
        if (showLabel) {
          const fontSize = node.isCategory ? 11 : node.r >= 10 ? 9 : 7;
          ctx!.font = `${highlight ? "bold " : ""}${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx!.fillStyle = hexWithAlpha(
            "#f7f7f8",
            highlight ? 0.95 : node.isCategory ? 0.65 : node.r >= 10 ? 0.4 : 0.25
          );
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(node.label, node.x, node.y + node.r + fontSize + 2);
        }
      }
    }

    // -------------------------------------------------------------------
    // Animation loop
    // -------------------------------------------------------------------

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

    // -------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Utility: hex colour with alpha
// ---------------------------------------------------------------------------

function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
