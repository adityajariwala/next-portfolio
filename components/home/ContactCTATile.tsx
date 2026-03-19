"use client";

import { useContactModal } from "@/lib/contact-context";
import Tile from "@/components/ui/Tile";

export default function ContactCTATile() {
  const { open } = useContactModal();

  return (
    <Tile
      accent="pink"
      className="relative overflow-hidden cursor-pointer flex flex-col justify-between"
      onClick={open}
    >
      {/* Gradient bg accent */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 30%, #ff2d95, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400 mb-3 block">
          Contact
        </span>
        <h3
          className="text-lg font-bold text-dark-50 mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let&apos;s build together
        </h3>
        <p className="text-sm text-dark-400 mb-4">
          Open to collaboration, consulting, and interesting conversations.
        </p>
      </div>

      <button
        className="relative z-10 w-full rounded-lg border border-neon-pink/30 bg-neon-pink/10 px-4 py-2 text-sm font-medium text-neon-pink transition-colors hover:bg-neon-pink/20"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        Get in Touch
      </button>
    </Tile>
  );
}
