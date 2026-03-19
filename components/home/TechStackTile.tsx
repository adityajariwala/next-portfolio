"use client";

import { useRef, useState, useCallback, type RefObject } from "react";
import { TECH_STACK } from "@/lib/constants";

const PILL_COLOR: Record<string, { border: string; text: string; glow: string }> = {
  cyan: { border: "rgba(0,240,255,0.25)", text: "rgba(0,240,255,0.85)", glow: "0,240,255" },
  yellow: { border: "rgba(255,240,31,0.25)", text: "rgba(255,240,31,0.85)", glow: "255,240,31" },
  green: { border: "rgba(57,255,20,0.25)", text: "rgba(57,255,20,0.85)", glow: "57,255,20" },
  purple: { border: "rgba(184,41,221,0.25)", text: "rgba(184,41,221,0.85)", glow: "184,41,221" },
};

const LABEL_STYLE: Record<string, string> = {
  cyan: "rgba(0,240,255,0.4)",
  yellow: "rgba(255,240,31,0.4)",
  green: "rgba(57,255,20,0.4)",
  purple: "rgba(184,41,221,0.4)",
};

export default function TechStackTile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: import("react").MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => setMouse(null), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="grid grid-cols-2 gap-4"
    >
      {Object.entries(TECH_STACK).map(([category, cat]) => {
        const colors = PILL_COLOR[cat.color] ?? PILL_COLOR.cyan;
        const labelColor = LABEL_STYLE[cat.color] ?? "rgba(255,255,255,0.3)";

        return (
          <div key={category}>
            <span className="text-[10px] font-mono block mb-2" style={{ color: labelColor }}>
              {category}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <Pill
                  key={item}
                  label={item}
                  colors={colors}
                  mouse={mouse}
                  containerRef={containerRef}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Pill({
  label,
  colors,
  mouse,
  containerRef,
}: {
  label: string;
  colors: { border: string; text: string; glow: string };
  mouse: { x: number; y: number } | null;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ cx: 0, cy: 0 });

  // Update cached position on pointer enter
  const handlePointerEnter = useCallback(() => {
    const pill = pillRef.current;
    const container = containerRef.current;
    if (!pill || !container) return;
    const rect = pill.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setPos({
      cx: rect.left - cRect.left + rect.width / 2,
      cy: rect.top - cRect.top + rect.height / 2,
    });
  }, [containerRef]);

  // Derive intensity from mouse + cached position (pure state, no refs)
  let intensity = 0;
  if (mouse && (pos.cx || pos.cy)) {
    const dist = Math.hypot(mouse.x - pos.cx, mouse.y - pos.cy);
    intensity = Math.max(0, 1 - dist / 120);
  }

  const glowAlpha = intensity * 0.6;
  const borderAlpha = 0.25 + intensity * 0.55;
  const textAlpha = 0.6 + intensity * 0.4;
  const bgAlpha = intensity * 0.12;

  return (
    <span
      ref={pillRef}
      onPointerEnter={handlePointerEnter}
      className="rounded border px-2 py-0.5 text-[11px] font-mono transition-[box-shadow,background-color] duration-100"
      style={{
        borderColor: `rgba(${colors.glow},${borderAlpha})`,
        color: `rgba(${colors.glow},${textAlpha})`,
        backgroundColor: `rgba(${colors.glow},${bgAlpha})`,
        boxShadow:
          intensity > 0.05
            ? `0 0 ${8 + intensity * 16}px rgba(${colors.glow},${glowAlpha})`
            : "none",
        transform: intensity > 0.3 ? `scale(${1 + intensity * 0.04})` : undefined,
      }}
    >
      {label}
    </span>
  );
}
