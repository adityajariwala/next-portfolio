"use client";

import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-neon-pink text-glow-pink mb-4">Error</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-dark-100 mb-4">Something went wrong</h2>
        <p className="text-dark-300 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <Button variant="accent" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
