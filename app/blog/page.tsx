"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag, Search, ArrowRight } from "lucide-react";
import Tile from "@/components/ui/Tile";
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
  return (
    <Suspense>
      <BlogPageContent />
    </Suspense>
  );
}

function BlogPageContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>(searchParams.get("tag") ?? "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }

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

  const featuredPost = filteredPosts[0] ?? null;
  const remainingPosts = filteredPosts.slice(1);

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
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 gradient-text pb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Blog
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Thoughts on the state of AI and software engineering today, lessons learned, case
            studies, &amp; the occasional rant.
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

        {/* Posts */}
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
            <div className="tile max-w-md mx-auto py-12 text-center">
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
                  variant="accent"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Featured Post — full-width hero tile */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10"
              >
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Tile accent="cyan" className="group cursor-pointer overflow-hidden">
                    {featuredPost.coverImage && (
                      <div className="aspect-[21/9] w-full overflow-hidden">
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          width={1200}
                          height={514}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-8 md:p-10">
                      <span className="text-[10px] font-mono text-neon-cyan/60 mb-2 block">
                        Latest
                      </span>

                      <h2 className="text-2xl md:text-3xl font-bold text-dark-50 group-hover:text-neon-cyan transition-colors duration-300 mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-dark-300 text-lg mb-6 max-w-3xl">{featuredPost.excerpt}</p>

                      <div className="flex flex-wrap items-center gap-4">
                        {/* Meta */}
                        <div
                          className="flex items-center gap-4 text-sm text-dark-400"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(featuredPost.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {featuredPost.readingTime}
                          </span>
                        </div>

                        {/* Tags */}
                        {featuredPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {featuredPost.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-dark-700 text-neon-purple text-xs rounded border border-dark-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        <span className="ml-auto flex items-center gap-1.5 text-neon-cyan text-sm font-medium group-hover:gap-2.5 transition-all duration-200">
                          Read more <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Tile>
                </Link>
              </motion.div>
            )}

            {/* Remaining posts — 2-col grid */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remainingPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="h-full block">
                      <Tile
                        accent="purple"
                        className="group h-full cursor-pointer overflow-hidden flex flex-col"
                      >
                        {post.coverImage && (
                          <div className="aspect-video w-full overflow-hidden">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={600}
                              height={338}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <h2 className="text-xl font-bold text-dark-50 group-hover:text-neon-cyan transition-colors duration-300 mb-3 line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-dark-300 text-sm line-clamp-3 mb-4 flex-1">
                            {post.excerpt}
                          </p>

                          {/* Meta */}
                          <div
                            className="flex items-center gap-3 text-xs text-dark-400 mb-4"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {post.readingTime}
                            </span>
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-dark-700 text-neon-purple text-xs rounded border border-dark-600"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="px-2 py-0.5 text-dark-400 text-xs">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Tile>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
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
