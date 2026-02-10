import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { OWNER_INFO } from "@/lib/constants";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              {OWNER_INFO.name}
            </h3>
            <p className="text-dark-300 text-sm">
              {OWNER_INFO.title} at {OWNER_INFO.company}
            </p>
            <p className="text-dark-400 text-sm mt-2">{OWNER_INFO.location}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-neon-cyan mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-dark-300 hover:text-neon-cyan transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-neon-cyan mb-4">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a
                href={OWNER_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-300 hover:text-neon-cyan transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href={OWNER_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-300 hover:text-neon-cyan transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href={`mailto:${OWNER_INFO.email}`}
                className="text-dark-300 hover:text-neon-cyan transition-colors duration-300"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="glow-line mt-8 mb-6" />

        {/* Copyright */}
        <div className="text-center text-dark-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {OWNER_INFO.name}. All rights
            reserved.
          </p>
          <p className="mt-1 text-xs font-mono">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
