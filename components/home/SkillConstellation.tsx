"use client";

import { useEffect, useRef, useCallback } from "react";
import { TECH_STACK } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConstellationNode {
  /** display label */
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
// Colour map
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, string> = {
  cyan: "#00f0ff",
  purple: "#b829dd",
  green: "#39ff14",
  yellow: "#fff01f",
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
// Build node list
// ---------------------------------------------------------------------------

function buildNodes(): ConstellationNode[] {
  const rng = mulberry32(42);
  const nodes: ConstellationNode[] = [];

  // Category centre regions — spread across the canvas
  const categoryRegions: { cx: number; cy: number }[] = [
    { cx: 0.22, cy: 0.28 }, // Languages – top-left area
    { cx: 0.75, cy: 0.25 }, // AI/ML – top-right area
    { cx: 0.28, cy: 0.72 }, // Cloud & DevOps – bottom-left
    { cx: 0.72, cy: 0.7 }, // Backend – bottom-right
  ];

  const categories = Object.entries(TECH_STACK);

  categories.forEach(([catName, catData], catIdx) => {
    const region = categoryRegions[catIdx];
    const color = COLOR_MAP[catData.color] ?? "#00f0ff";

    // Category node
    const catNodeIdx = nodes.length;
    nodes.push({
      label: catName,
      bx: region.cx + (rng() - 0.5) * 0.06,
      by: region.cy + (rng() - 0.5) * 0.06,
      x: 0,
      y: 0,
      r: 20 + rng() * 4, // 20-24
      color,
      isCategory: true,
      parentIdx: -1,
      phase: rng() * Math.PI * 2,
      driftAx: 2 + rng() * 2,
      driftAy: 2 + rng() * 2,
      driftPeriod: 3000 + rng() * 3000,
    });

    // Item nodes — satellites around category centre
    catData.items.forEach((item) => {
      const angle = rng() * Math.PI * 2;
      const dist = 0.06 + rng() * 0.08; // distance from category centre
      nodes.push({
        label: item,
        bx: region.cx + Math.cos(angle) * dist,
        by: region.cy + Math.sin(angle) * dist,
        x: 0,
        y: 0,
        r: 8 + rng() * 6, // 8-14
        color,
        isCategory: false,
        parentIdx: catNodeIdx,
        phase: rng() * Math.PI * 2,
        driftAx: 1.5 + rng() * 2.5,
        driftAy: 1.5 + rng() * 2.5,
        driftPeriod: 3000 + rng() * 3000,
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

    // Initial sizing
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

      // Parallax offset
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
          // Drift
          const driftX = Math.sin((t / node.driftPeriod) * Math.PI * 2 + node.phase) * node.driftAx;
          const driftY =
            Math.cos((t / node.driftPeriod) * Math.PI * 2 + node.phase * 1.3) * node.driftAy;
          x += driftX;
          y += driftY;

          // Cursor gravity
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

          // Parallax
          x += px;
          y += py;
        }

        node.x = x;
        node.y = y;
      }
    }

    function draw(_t: number) {
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
          if (dx * dx + dy * dy < n.r * n.r) {
            hoveredIdx = i;
            break;
          }
        }
      }

      // Connection lines
      for (const node of nodes) {
        if (node.parentIdx < 0) continue;
        const parent = nodes[node.parentIdx];

        // Check if this connection should be highlighted
        const nodeIdx = nodes.indexOf(node);
        const isHighlighted =
          hoveredIdx >= 0 &&
          (hoveredIdx === nodeIdx ||
            hoveredIdx === node.parentIdx ||
            // If hovered node is a category, highlight all its children
            (nodes[hoveredIdx].isCategory && hoveredIdx === node.parentIdx) ||
            // If hovered node is a child, highlight sibling connections via shared parent
            (!nodes[hoveredIdx].isCategory && nodes[hoveredIdx].parentIdx === node.parentIdx));

        ctx!.beginPath();
        ctx!.moveTo(parent.x, parent.y);
        ctx!.lineTo(node.x, node.y);
        ctx!.strokeStyle = isHighlighted
          ? hexWithAlpha(node.color, 0.35)
          : hexWithAlpha(node.color, 0.07);
        ctx!.lineWidth = isHighlighted ? 1.2 : 0.6;
        ctx!.stroke();
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
        ctx!.fillStyle = hexWithAlpha(node.color, highlight ? 0.18 : 0.06);
        ctx!.fill();

        // Circle stroke
        ctx!.strokeStyle = hexWithAlpha(node.color, highlight ? 0.8 : node.isCategory ? 0.4 : 0.2);
        ctx!.lineWidth = highlight ? 1.8 : node.isCategory ? 1.2 : 0.7;
        ctx!.stroke();

        // Glow on hover
        if (isHovered) {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
          ctx!.strokeStyle = hexWithAlpha(node.color, 0.25);
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        // Label
        const fontSize = node.isCategory ? 11 : 9;
        ctx!.font = `${highlight ? "bold " : ""}${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx!.fillStyle = hexWithAlpha("#f7f7f8", highlight ? 0.95 : node.isCategory ? 0.7 : 0.45);
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";

        const labelY = node.y + node.r + fontSize + 2;
        ctx!.fillText(node.label, node.x, labelY);
      }
    }

    // -------------------------------------------------------------------
    // Animation loop
    // -------------------------------------------------------------------

    if (prefersReduced || isMobile) {
      // Static render
      resolvePositions(0);
      draw(0);
    } else {
      const loop = (t: number) => {
        resolvePositions(t);
        draw(t);
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
  // Parse hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
