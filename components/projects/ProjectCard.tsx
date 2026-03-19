"use client";

import { useRef, useCallback, useEffect, type MouseEvent } from "react";
import { Github, ExternalLink, Star } from "lucide-react";
import { LANGUAGE_COLORS } from "@/lib/constants";

interface ProjectCardProps {
  repo: {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
    pushed_at?: string;
  };
  index: number;
}

export default function ProjectCard({ repo, index }: ProjectCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const langColor = LANGUAGE_COLORS[repo.language ?? ""] ?? "#00f0ff";

  // Entrance animation
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const timer = setTimeout(() => {
      el.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateY = ((x - cx) / cx) * 12;
      const rotateX = ((cy - y) / cy) * 12;
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;

      // Direct DOM updates — no React re-render
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      if (glowRef.current) {
        glowRef.current.style.opacity = "1";
        glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, ${langColor}18, transparent 60%)`;
      }
      if (titleRef.current) {
        titleRef.current.style.transform = "translateZ(20px)";
      }
      if (borderRef.current) {
        borderRef.current.style.borderColor = `${langColor}55`;
        borderRef.current.style.boxShadow = `0 0 30px ${langColor}15, 0 20px 40px rgba(0,0,0,0.4)`;
      }
    },
    [langColor]
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.4s ease-out";
      cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
    if (titleRef.current) {
      titleRef.current.style.transform = "translateZ(0)";
    }
    if (borderRef.current) {
      borderRef.current.style.borderColor = "#1a1a1a";
      borderRef.current.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    }
  }, []);

  const pushedAgo = repo.pushed_at ? getTimeAgo(repo.pushed_at) : null;

  return (
    <div ref={wrapperRef} style={{ perspective: 800 }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-lg overflow-hidden will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => {
          if (cardRef.current) cardRef.current.style.transition = "none";
        }}
      >
        {/* Cursor-following glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ opacity: 0, transition: "opacity 0.2s ease-out" }}
        />

        {/* Card body */}
        <div
          ref={borderRef}
          className="relative border rounded-lg"
          style={{
            borderColor: "#1a1a1a",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            backgroundColor: "rgba(13,13,18,0.9)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-surface-border">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#febc2e" }} />
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#28c840" }} />
            <span className="ml-2 text-[10px] font-mono text-dark-500 truncate">~/{repo.name}</span>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-dark-500 hover:text-neon-cyan transition-colors"
              >
                <ExternalLink size={10} />
              </a>
            )}
          </div>

          {/* Card content */}
          <div className="p-4 flex flex-col gap-3">
            {/* Project name — floats in 3D */}
            <div
              ref={titleRef}
              className="flex items-start justify-between gap-2"
              style={{ transition: "transform 0.15s ease-out" }}
            >
              <h3
                className="text-base font-bold text-dark-100 line-clamp-1 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
                title={repo.name}
              >
                {repo.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-dark-400 text-sm line-clamp-3 leading-relaxed">
              {repo.description || "No description available."}
            </p>

            {/* Topics as --flags */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {repo.topics.slice(0, 4).map((topic) => (
                  <span key={topic} className="text-[10px] font-mono text-dark-500">
                    --{topic}
                  </span>
                ))}
              </div>
            )}

            {/* Terminal-style status line */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-dark-500">
              <span className="text-dark-600">$</span>
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: langColor }}
                  />
                  <span style={{ color: `${langColor}cc` }}>{repo.language}</span>
                </span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={10} />
                  {repo.stargazers_count}
                </span>
              )}
              {pushedAgo && <span className="text-dark-600 ml-auto">{pushedAgo}</span>}
            </div>

            {/* Action row */}
            <div className="flex gap-2 pt-1">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <button
                  className="w-full flex items-center justify-center gap-2 text-xs font-mono py-2 rounded border transition-all duration-200"
                  style={{
                    borderColor: `${langColor}30`,
                    color: langColor,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${langColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <Github size={13} />
                  <span>$ open</span>
                </button>
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className="w-full flex items-center justify-center gap-2 text-xs font-mono py-2 rounded border border-dark-700 text-dark-300 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-200">
                    <ExternalLink size={13} />
                    <span>live</span>
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
