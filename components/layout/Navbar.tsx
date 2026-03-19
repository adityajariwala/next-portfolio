"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useContactModal } from "@/lib/contact-context";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { open: openContact } = useContactModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-dark-900/80 backdrop-blur-md border-b border-dark-700" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-neon-cyan hover:scale-105 transition-transform font-mono"
            style={{ fontFamily: "var(--font-display)" }}
          >
            aj&gt;_
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative group",
                  pathname === link.path ? "text-neon-cyan" : "text-dark-100 hover:text-neon-cyan"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full",
                    pathname === link.path && "w-full"
                  )}
                />
              </Link>
            ))}

            {/* Contact CTA */}
            <button
              onClick={openContact}
              className="text-sm font-medium px-4 py-1.5 border border-neon-cyan text-neon-cyan bg-transparent rounded transition-all duration-300 hover:bg-neon-cyan/10 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neon-cyan"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-800 border-t border-dark-700"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_ITEMS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 rounded transition-all duration-300",
                    pathname === link.path
                      ? "bg-dark-700 text-neon-cyan"
                      : "text-dark-100 hover:bg-dark-700 hover:text-neon-cyan"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Contact Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openContact();
                }}
                className="block w-full text-left px-4 py-2 rounded border border-neon-cyan text-neon-cyan bg-transparent transition-all duration-300 hover:bg-neon-cyan/10"
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
