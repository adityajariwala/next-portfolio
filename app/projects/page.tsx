"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/projects/ProjectCard";
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
  pushed_at?: string;
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
      if (!response.ok) throw new Error("Failed to fetch repositories");
      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique languages (hide niche/old ones from filter)
  const HIDDEN_FILTERS = new Set(["Go Template", "C#", "C++"]);
  const languages = [
    "All",
    ...Array.from(
      new Set(
        repos.map((r) => r.language).filter((l): l is string => !!l && !HIDDEN_FILTERS.has(l))
      )
    ),
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
              <Button variant="accent" onClick={fetchRepos}>
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
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
