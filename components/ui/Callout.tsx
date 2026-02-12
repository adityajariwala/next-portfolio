import React, { ReactNode } from "react";

type CalloutType = "info" | "warning" | "success" | "note";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const styles: Record<CalloutType, string> = {
  info: "border-neon-cyan bg-dark-800/50 text-dark-100",
  warning: "border-neon-yellow bg-dark-800/50 text-dark-100",
  success: "border-neon-green bg-dark-800/50 text-dark-100",
  note: "border-neon-purple bg-dark-800/50 text-dark-100",
};

export default function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}
