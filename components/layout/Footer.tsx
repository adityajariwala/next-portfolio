import { Github, Linkedin, Mail } from "lucide-react";
import { OWNER_INFO, SOCIAL_LINKS } from "@/lib/constants";

const iconMap = {
  Github,
  Linkedin,
  Mail,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20">
      <div className="glow-line" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            {SOCIAL_LINKS.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="text-dark-400 hover:text-neon-cyan transition-colors duration-300"
                  aria-label={link.platform}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-dark-400 text-sm">
            &copy; {year} {OWNER_INFO.name}
          </p>

          {/* Built with tag */}
          <p
            className="text-dark-500 text-xs font-mono"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {"// built with Next.js"}
          </p>
        </div>
      </div>
    </footer>
  );
}
