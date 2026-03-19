"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Star, GitFork, Loader2 } from "lucide-react";
import Tile from "@/components/ui/Tile";
import Button from "@/components/ui/Button";
import { LANGUAGE_COLORS } from "@/lib/constants";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique languages from fetched repos
  const languages = [
    "All",
    ...Array.from(new Set(repos.map((r) => r.language).filter((l): l is string => !!l))),
  ];

  const filteredRepos =
    selectedLanguage === "All" ? repos : repos.filter((r) => r.language === selectedLanguage);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 gradient-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projects
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            A collection of my recent work and open-source contributions from GitHub.
          </p>
        </motion.div>

        {/* Language Filter Bar */}
        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {languages.map((lang) => {
              const isActive = selectedLanguage === lang;
              const langColor = lang !== "All" ? LANGUAGE_COLORS[lang] : undefined;

              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className="px-3 py-1 rounded-full text-xs font-mono border transition-all duration-200"
                  style={
                    isActive && langColor
                      ? {
                          borderColor: langColor,
                          color: langColor,
                          boxShadow: `0 0 10px ${langColor}55`,
                          backgroundColor: `${langColor}18`,
                        }
                      : isActive
                        ? {
                            borderColor: "rgb(0,240,255)",
                            color: "rgb(0,240,255)",
                            boxShadow: "0 0 10px rgba(0,240,255,0.3)",
                            backgroundColor: "rgba(0,240,255,0.08)",
                          }
                        : {
                            borderColor: "#2a2a3a",
                            color: "#71717a",
                          }
                  }
                >
                  {lang}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
            <p className="text-dark-300 font-mono text-sm">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <p className="text-neon-pink text-lg mb-6 font-mono">
                Failed to load projects: {error}
              </p>
              <Button variant="cyber" onClick={fetchRepos}>
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRepos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-dark-300 font-mono text-sm">
              No projects found
              {selectedLanguage !== "All" ? ` for ${selectedLanguage}` : ""}.
            </p>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredRepos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Tile accent="cyan" className="flex flex-col gap-4 p-5">
                  {/* Repo name + github icon */}
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-base font-bold text-dark-100 line-clamp-1 leading-snug"
                      title={repo.name}
                    >
                      {repo.name}
                    </h3>
                    <Github size={16} className="text-dark-400 shrink-0 mt-0.5" />
                  </div>

                  {/* Description */}
                  <p className="text-dark-300 text-sm line-clamp-3 leading-relaxed">
                    {repo.description || "No description available."}
                  </p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 bg-dark-700 rounded-full text-xs text-dark-300 font-mono border border-dark-600"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Language + stats */}
                  <div className="flex items-center gap-4 text-xs text-dark-400 font-mono">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[repo.language] || "#888",
                          }}
                        />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star size={12} />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork size={12} />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 pt-1">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 text-xs"
                      >
                        <Github size={14} />
                        <span>View Code</span>
                      </Button>
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-center gap-2 text-xs"
                        >
                          <ExternalLink size={14} />
                          <span>Live</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </Tile>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
