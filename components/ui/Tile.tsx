import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface TileProps extends HTMLAttributes<HTMLDivElement> {
  accent?: "cyan" | "purple" | "green" | "yellow" | "pink" | "orange";
}

const Tile = forwardRef<HTMLDivElement, TileProps>(
  ({ className, accent, children, ...props }, ref) => {
    const accentColors = {
      cyan: "hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
      purple: "hover:border-neon-purple hover:shadow-[0_0_20px_rgba(185,41,221,0.15)]",
      green: "hover:border-neon-green hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
      yellow: "hover:border-neon-yellow hover:shadow-[0_0_20px_rgba(255,240,31,0.15)]",
      pink: "hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,45,149,0.15)]",
      orange: "hover:border-neon-orange hover:shadow-[0_0_20px_rgba(255,107,53,0.15)]",
    };

    return (
      <div ref={ref} className={cn("tile", accent && accentColors[accent], className)} {...props}>
        {children}
      </div>
    );
  }
);

Tile.displayName = "Tile";
export default Tile;
