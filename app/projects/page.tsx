"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Star, GitFork, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
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

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.github.com/users/adityajariwala/repos?sort=updated&per_page=12"
      );

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

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">Projects</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            A collection of my recent work and open-source contributions. Check out my GitHub for
            more!
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
            <p className="text-dark-300">Loading projects...</p>
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
              <p className="text-neon-pink text-lg mb-6">Failed to load projects: {error}</p>
              <Button variant="cyber" onClick={fetchRepos}>
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && repos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-dark-300 text-lg">No projects found.</p>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card glow className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="text-xl font-bold text-neon-cyan hover:text-neon-pink transition-colors line-clamp-1"
                        title={repo.name}
                      >
                        {repo.name}
                      </h3>
                      <Github size={20} className="text-dark-400 flex-shrink-0" />
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-dark-300 text-sm mb-4 line-clamp-3">
                      {repo.description || "No description available"}
                    </p>

                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-200 font-mono"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Language & Stats */}
                    <div className="flex items-center gap-4 text-sm text-dark-400">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: LANGUAGE_COLORS[repo.language] || "#888",
                            }}
                          />
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star size={14} />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork size={14} />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Github size={16} />
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
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          <span>Live</span>
                        </Button>
                      </a>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
