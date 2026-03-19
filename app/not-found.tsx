import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-neon-cyan text-glow-cyan mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-dark-100 mb-4">Page Not Found</h2>
        <p className="text-dark-300 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="accent">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
