import React from "react";

interface NewsletterSignupProps {
  disabled?: boolean;
}

export default function NewsletterSignup({ disabled = false }: NewsletterSignupProps) {
  return (
    <div className="my-12 rounded-lg border border-neon-purple bg-dark-800 p-6 text-center">
      <h3 className="text-lg font-semibold text-neon-purple">Subscribe to the Newsletter</h3>

      <p className="mt-2 text-sm text-dark-300">
        Get notified when new posts go live. No spam, unsubscribe anytime.
      </p>

      {disabled ? (
        <p className="mt-4 text-sm italic text-dark-400">Coming soon 👀</p>
      ) : (
        <form className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full max-w-xs rounded-md border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-dark-50 focus:border-neon-cyan focus:outline-none"
            required
          />
          <button
            type="submit"
            className="rounded-md bg-neon-cyan px-4 py-2 text-sm font-medium text-dark-900 hover:bg-neon-pink"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
