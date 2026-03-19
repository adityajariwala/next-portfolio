import { fetchGitHubStats, fetchGitHubEvents, fetchFeaturedRepos } from "@/lib/github";
import { OWNER_INFO, TECH_STACK, FEATURED_PROJECTS } from "@/lib/constants";
import { getAllPosts } from "@/lib/blog";
import Tile from "@/components/ui/Tile";
import CareerTimeline from "@/components/home/CareerTimeline";
import AnimatedTile from "@/components/home/AnimatedTile";
import ContactCTATile from "@/components/home/ContactCTATile";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

/* ── types ──────────────────────────────────────────────────────── */
interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
}

/* ── colour helpers ─────────────────────────────────────────────── */
const categoryBorderMap: Record<string, string> = {
  cyan: "border-neon-cyan/30 text-neon-cyan",
  yellow: "border-neon-yellow/30 text-neon-yellow",
  green: "border-neon-green/30 text-neon-green",
  purple: "border-neon-purple/30 text-neon-purple",
};

const LANGUAGE_DOT: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Shell: "#89e051",
};

/* ── component ──────────────────────────────────────────────────── */
export default async function BentoGrid() {
  const [stats, events, featuredRepos] = await Promise.all([
    fetchGitHubStats(),
    fetchGitHubEvents(),
    fetchFeaturedRepos(FEATURED_PROJECTS),
  ]);

  const posts = getAllPosts();
  const latestPost = posts[0] ?? null;

  const pushEvents = events.filter((e) => e.type === "PushEvent");

  // Flatten tech stack tags
  const allTags: { name: string; color: string }[] = [];
  for (const [, cat] of Object.entries(TECH_STACK)) {
    for (const item of cat.items) {
      allTags.push({ name: item, color: cat.color });
    }
  }
  const visibleTags = allTags.slice(0, 10);
  const extraCount = allTags.length - visibleTags.length;

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{
          gridTemplateRows: "auto",
        }}
      >
        {/* ── 1. About tile (row-span 2) ────────────────────────── */}
        <AnimatedTile delay={0} className="lg:row-span-2">
          <Tile accent="cyan" className="h-full flex flex-col">
            {/* Avatar */}
            <div className="mb-4 h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-neon-cyan shadow-lg shadow-neon-cyan/30">
              <Image
                src="/aditya.jpg"
                alt={OWNER_INFO.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <h2
              className="text-xl font-bold text-dark-50 mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {OWNER_INFO.name}
            </h2>
            <p className="text-sm text-neon-cyan mb-1">{OWNER_INFO.title}</p>
            <p className="text-xs text-dark-400 mb-4">
              {OWNER_INFO.company} &middot; {OWNER_INFO.location}
            </p>
            <p className="text-sm text-dark-300 leading-relaxed mb-6 flex-1">{OWNER_INFO.bio}</p>

            {/* Experience tags */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Capital One", color: "#00f0ff" },
                { label: "D2iQ", color: "#b829dd" },
                { label: "Red Hat", color: "#39ff14" },
              ].map((t) => (
                <span
                  key={t.label}
                  className="rounded-md border px-2 py-0.5 text-[10px] font-mono"
                  style={{ borderColor: `${t.color}44`, color: t.color }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </Tile>
        </AnimatedTile>

        {/* ── 2. Stats tile ─────────────────────────────────────── */}
        <AnimatedTile delay={0.05}>
          <Tile accent="cyan" className="h-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400 mb-4 block">
              Stats
            </span>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-dark-50">{stats.publicRepos}</p>
                <p className="text-[10px] text-dark-400 font-mono">repos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-50">{stats.totalStars}</p>
                <p className="text-[10px] text-dark-400 font-mono">stars</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-50">7+</p>
                <p className="text-[10px] text-dark-400 font-mono">yrs exp</p>
              </div>
            </div>
          </Tile>
        </AnimatedTile>

        {/* ── 3. GitHub tile ────────────────────────────────────── */}
        <AnimatedTile delay={0.1}>
          <Tile accent="green" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400">
                GitHub
              </span>
              <Link
                href={OWNER_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-neon-green transition-colors"
              >
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-dark-200 mb-2">
              <span className="font-bold text-dark-50">{pushEvents.length}</span>{" "}
              <span className="text-dark-400">recent pushes</span>
            </p>
            <p className="text-sm text-dark-400">{stats.publicRepos} public repos</p>
          </Tile>
        </AnimatedTile>

        {/* ── 4. Tech Stack tile (col-span 2) ───────────────────── */}
        <AnimatedTile delay={0.15} className="md:col-span-2">
          <Tile accent="yellow" className="h-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400 mb-4 block">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag.name}
                  className={`rounded-md border px-2.5 py-1 text-xs font-mono ${categoryBorderMap[tag.color] ?? "border-dark-600 text-dark-300"}`}
                >
                  {tag.name}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="rounded-md border border-dark-600 px-2.5 py-1 text-xs font-mono text-dark-400">
                  +{extraCount} more
                </span>
              )}
            </div>
          </Tile>
        </AnimatedTile>

        {/* ── 5 & 6. Featured Project tiles ─────────────────────── */}
        {(featuredRepos as GitHubRepo[]).slice(0, 2).map((repo, i) => (
          <AnimatedTile key={repo.name} delay={0.2 + i * 0.05}>
            <Tile accent="purple" className="h-full relative overflow-hidden">
              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 h-24 w-24 opacity-10 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 100% 0%, #b829dd, transparent 70%)",
                }}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400 mb-3 block">
                Project
              </span>
              <h3
                className="text-base font-bold text-dark-50 mb-1 truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {repo.name}
              </h3>
              <p className="text-sm text-dark-400 mb-3 line-clamp-2">
                {repo.description ?? "No description"}
              </p>
              <div className="flex items-center gap-3 text-xs text-dark-500">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: LANGUAGE_DOT[repo.language] ?? "#888",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={10} />
                  {repo.stargazers_count}
                </span>
              </div>
              <Link
                href={repo.html_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
              >
                <span className="sr-only">View {repo.name} on GitHub</span>
              </Link>
            </Tile>
          </AnimatedTile>
        ))}

        {/* ── 7. Latest Blog Post tile ──────────────────────────── */}
        <AnimatedTile delay={0.3}>
          <Tile accent="pink" className="h-full flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400 mb-3 block">
              Latest Post
            </span>
            {latestPost ? (
              <>
                <h3
                  className="text-base font-bold text-dark-50 mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {latestPost.title}
                </h3>
                <p className="text-sm text-dark-400 mb-4 flex-1 line-clamp-2">
                  {latestPost.excerpt}
                </p>
                <Link
                  href={`/blog/${latestPost.slug}`}
                  className="text-sm font-medium text-neon-pink hover:underline"
                >
                  Read &rarr;
                </Link>
              </>
            ) : (
              <p className="text-sm text-dark-500">No posts yet.</p>
            )}
          </Tile>
        </AnimatedTile>

        {/* ── 8. Career Timeline tile (col-span 2) ──────────────── */}
        <AnimatedTile delay={0.35} className="md:col-span-2">
          <Tile accent="cyan" className="h-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-dark-400 mb-4 block">
              Career Path
            </span>
            <CareerTimeline />
          </Tile>
        </AnimatedTile>

        {/* ── 9. Contact CTA tile ───────────────────────────────── */}
        <AnimatedTile delay={0.4} className="lg:col-span-1">
          <div id="contact" className="h-full">
            <ContactCTATile />
          </div>
        </AnimatedTile>
      </div>
    </section>
  );
}
