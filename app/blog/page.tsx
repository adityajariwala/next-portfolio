"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, Tag, Search } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog posts
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedTag, searchQuery, posts]);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">Blog</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Thoughts on software engineering, AI/ML, cloud architecture, and lessons learned
            building scalable systems.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
              />
            </div>

            {/* Tag filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 bg-dark-800 border border-dark-700 rounded focus:outline-none focus:border-neon-cyan transition-colors text-dark-50"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Active filters display */}
          {(selectedTag || searchQuery) && (
            <div className="flex gap-2 flex-wrap">
              {selectedTag && (
                <span className="px-3 py-1 bg-dark-700 text-neon-cyan border border-neon-cyan rounded-full text-sm flex items-center gap-2">
                  <Tag size={14} />
                  {selectedTag}
                  <button
                    onClick={() => setSelectedTag("")}
                    className="hover:text-neon-pink transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-dark-700 text-neon-purple border border-neon-purple rounded-full text-sm flex items-center gap-2">
                  <Search size={14} />
                  &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-neon-pink transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-dark-300">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-neon-cyan mb-4">
                  {posts.length === 0 ? "No posts yet" : "No posts found"}
                </h3>
                <p className="text-dark-300 mb-6">
                  {posts.length === 0
                    ? "Check back soon for insights on software engineering, AI/ML, and cloud architecture."
                    : "Try adjusting your search or filters."}
                </p>
                {(selectedTag || searchQuery) && (
                  <Button
                    onClick={() => {
                      setSelectedTag("");
                      setSearchQuery("");
                    }}
                    variant="cyber"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card
                    glow
                    className="h-full hover:border-neon-cyan transition-all duration-300 cursor-pointer"
                  >
                    {post.coverImage && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <h2 className="text-2xl font-bold text-neon-cyan hover:text-neon-pink transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-dark-400 mt-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-dark-300 line-clamp-3 mb-4">{post.excerpt}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-dark-700 text-neon-purple text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 text-dark-400 text-xs">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-dark-400 text-sm"
          >
            Showing {filteredPosts.length} of {posts.length} posts
          </motion.div>
        )}
      </div>
    </div>
  );
}
