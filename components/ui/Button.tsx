import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-neon-cyan text-dark-900 hover:bg-neon-pink hover:text-dark-50 font-bold px-6 py-3",
      secondary:
        "bg-dark-800 text-neon-cyan border-2 border-neon-cyan hover:bg-neon-cyan hover:text-dark-900 font-bold px-6 py-3",
      ghost: "text-neon-cyan hover:text-neon-pink hover:bg-dark-800 px-6 py-3",
      accent:
        "bg-transparent text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] font-medium px-6 py-3",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
