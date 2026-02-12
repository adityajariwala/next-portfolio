import React from "react";

interface StatProps {
  label: string;
  value: string;
  context?: string;
}

export default function Stat({ label, value, context }: StatProps) {
  return (
    <div className="my-8 rounded-lg border border-neon-cyan bg-dark-800 p-6 shadow-lg shadow-neon-cyan/20">
      <div className="text-4xl font-bold tracking-tight text-neon-cyan">{value}</div>
      <div className="mt-1 text-sm font-medium text-dark-200">{label}</div>
      {context && <div className="mt-2 text-xs text-dark-400">{context}</div>}
    </div>
  );
}
