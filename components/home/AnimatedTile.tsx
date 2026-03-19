"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedTileProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedTile({ children, delay = 0, className }: AnimatedTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
