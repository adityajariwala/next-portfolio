"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAREER_TIMELINE } from "@/lib/constants";

export default function CareerTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const allDots = [
    ...CAREER_TIMELINE,
    { company: "Next?", role: "What comes next", period: "TBD", color: "#333" },
  ];

  return (
    <div className="relative w-full py-4">
      {/* Horizontal gradient line */}
      <div className="relative flex justify-between items-center">
        <div
          className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2"
          style={{
            background: "linear-gradient(90deg, #39ff14, #b829dd, #00f0ff, #333)",
          }}
        />

        {allDots.map((item, i) => {
          const isLast = i === allDots.length - 1;
          return (
            <div key={item.company} className="relative flex flex-col items-center z-10">
              {/* Hover card above */}
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-14 whitespace-nowrap rounded-md border border-surface-border bg-dark-800 px-3 py-1.5 text-xs text-dark-100"
                    style={{ boxShadow: `0 0 12px ${item.color}33` }}
                  >
                    {item.role}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot */}
              <motion.div
                className="rounded-full cursor-pointer"
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: isLast ? "transparent" : item.color,
                  border: isLast ? `2px solid ${item.color}` : "none",
                  boxShadow: isLast ? "none" : `0 0 8px ${item.color}66`,
                }}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Label below */}
              <div className="mt-6 flex flex-col items-center gap-0.5">
                <span
                  className="text-xs font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: item.color }}
                >
                  {item.company}
                </span>
                <span className="font-mono text-dark-500" style={{ fontSize: 9 }}>
                  {item.period}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
