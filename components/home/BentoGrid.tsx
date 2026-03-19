import { fetchGitHubStats, fetchGitHubEvents, fetchFeaturedRepos } from "@/lib/github";
import { OWNER_INFO, FEATURED_PROJECTS } from "@/lib/constants";
import { getAllPosts } from "@/lib/blog";
import Tile from "@/components/ui/Tile";
import CareerTimeline from "@/components/home/CareerTimeline";
import AnimatedTile from "@/components/home/AnimatedTile";
import ContactCTATile from "@/components/home/ContactCTATile";
import TechStackTile from "@/components/home/TechStackTile";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/* ── types ──────────────────────────────────────────────────────── */
interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
}

/* ── colour maps ─────────────────────────────────────────────────── */
const LANGUAGE_DOT: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Shell: "#89e051",
};

/* ── label ───────────────────────────────────────────────────────── */
function TileLabel({ children }: { children: import("react").ReactNode }) {
  return <span className="text-[10px] font-mono text-dark-500 mb-3 block">{children}</span>;
}

/* ── component ──────────────────────────────────────────────────── */
export default async function BentoGrid() {
  const [stats, events, featuredRepos] = await Promise.all([
    fetchGitHubStats(),
    fetchGitHubEvents(),
    fetchFeaturedRepos(FEATURED_PROJECTS),
  ]);

  const posts = getAllPosts();
  const latestPost = posts[0] ?? null;

  // Recent commit messages
  const recentCommits: { repo: string; message: string }[] = [];
  for (const e of events) {
    if (e.type === "PushEvent" && e.payload?.commits) {
      const repo = e.repo.name.split("/").pop() ?? "";
      for (const c of e.payload.commits.slice(-1)) {
        recentCommits.push({ repo, message: c.message.split("\n")[0] });
      }
    }
    if (recentCommits.length >= 4) break;
  }

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ── 1. About (row-span 2) ──────────────────────────────── */}
        <AnimatedTile delay={0} className="lg:row-span-2">
          <Tile accent="cyan" className="h-full flex flex-col">
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
            <div className="text-sm text-dark-300 leading-relaxed mb-6 flex-1 space-y-3">
              {OWNER_INFO.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
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

        {/* ── 2. GitHub (col-span 2) ─────────────────────────────── */}
        <AnimatedTile delay={0.05} className="md:col-span-2">
          <Tile accent="green" className="h-full">
            <div className="flex items-center justify-between mb-5">
              <TileLabel>GitHub</TileLabel>
              <Link
                href={OWNER_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-500 hover:text-neon-green transition-colors"
              >
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex mb-5" style={{ gap: 40 }}>
              <div className="flex items-baseline" style={{ gap: 8 }}>
                <span className="text-3xl font-bold text-dark-50">{stats.publicRepos}</span>
                <span className="text-[11px] text-dark-500 font-mono">repos</span>
              </div>
              <div className="flex items-baseline" style={{ gap: 8 }}>
                <span className="text-3xl font-bold text-dark-50">
                  {stats.languageBreakdown.length}
                </span>
                <span className="text-[11px] text-dark-500 font-mono">languages</span>
              </div>
              <div className="flex items-baseline" style={{ gap: 8 }}>
                <span className="text-3xl font-bold text-dark-50">7+</span>
                <span className="text-[11px] text-dark-500 font-mono">yrs exp</span>
              </div>
            </div>

            {/* Thick language bar */}
            <div
              className="flex w-full overflow-hidden rounded-md mb-3"
              style={{ height: 10, gap: 2 }}
            >
              {stats.languageBreakdown.map((lang) => (
                <div
                  key={lang.language}
                  className="rounded-sm"
                  style={{
                    flex: lang.count,
                    minWidth: 8,
                    backgroundColor: lang.color,
                  }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap mb-5" style={{ gap: "8px 20px" }}>
              {stats.languageBreakdown.map((lang) => (
                <span
                  key={lang.language}
                  className="flex items-center text-xs text-dark-300"
                  style={{ gap: 6 }}
                >
                  <span
                    className="inline-block rounded-full shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: lang.color,
                    }}
                  />
                  {lang.language}
                </span>
              ))}
            </div>

            {/* Recent commits */}
            {recentCommits.length > 0 && (
              <div className="border-t border-surface-border pt-3">
                <span className="text-[9px] font-mono text-dark-500 mb-2 block">
                  Recent commits
                </span>
                <div className="space-y-1.5">
                  {recentCommits.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex items-baseline gap-2 text-xs">
                      <span className="text-neon-green/60 font-mono shrink-0 truncate max-w-[100px]">
                        {c.repo}
                      </span>
                      <span className="text-dark-400 truncate">{c.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Tile>
        </AnimatedTile>

        {/* ── 3. Tech Stack (col-span 2) ─────────────────────────── */}
        <AnimatedTile delay={0.1} className="md:col-span-2">
          <Tile accent="yellow" className="h-full">
            <TileLabel>Tech Stack</TileLabel>
            <TechStackTile />
          </Tile>
        </AnimatedTile>

        {/* ── 4 & 5. Featured Projects ───────────────────────────── */}
        {(featuredRepos as GitHubRepo[]).slice(0, 2).map((repo, i) => (
          <AnimatedTile key={repo.name} delay={0.15 + i * 0.05}>
            <Tile accent="purple" className="h-full relative overflow-hidden">
              <div
                className="absolute top-0 right-0 h-24 w-24 opacity-10 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 100% 0%, #b829dd, transparent 70%)",
                }}
              />
              <TileLabel>Project</TileLabel>
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
                      style={{ backgroundColor: LANGUAGE_DOT[repo.language] ?? "#888" }}
                    />
                    {repo.language}
                  </span>
                )}
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

        {/* ── 6. Latest Blog Post ────────────────────────────────── */}
        <AnimatedTile delay={0.25}>
          <Tile accent="pink" className="h-full flex flex-col">
            <TileLabel>Latest Post</TileLabel>
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

        {/* ── 7. Career Timeline (col-span 2) ────────────────────── */}
        <AnimatedTile delay={0.3} className="md:col-span-2">
          <Tile accent="cyan" className="h-full">
            <TileLabel>Career Path</TileLabel>
            <CareerTimeline />
          </Tile>
        </AnimatedTile>

        {/* ── 8. Contact CTA ─────────────────────────────────────── */}
        <AnimatedTile delay={0.35} className="lg:col-span-1">
          <div id="contact" className="h-full">
            <ContactCTATile />
          </div>
        </AnimatedTile>
      </div>
    </section>
  );
}
