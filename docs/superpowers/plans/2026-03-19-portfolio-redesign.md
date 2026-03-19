# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio site with a "Cinematic + Dashboard" hybrid approach — asymmetric hero with interactive skill constellation, bento grid dashboard, contact modal, and consolidated 4-route structure.

**Architecture:** Restructure `lib/constants.ts` with new config types, replace Inter with JetBrains Mono + Geist Sans dual-font system, rewrite the home page as a rich scrollable showcase with hero + bento sections, add a layout-level contact modal, redesign projects/blog/resume pages with new tile aesthetic, and simplify navbar/footer. The hero constellation is a custom Canvas component.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Framer Motion, HTML5 Canvas, `geist` font package, `next/font/google` for JetBrains Mono.

**Spec:** `docs/superpowers/specs/2026-03-19-portfolio-redesign-design.md`

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `components/ui/Tile.tsx` | Bento tile component with magnetic hover, glow border, scale micro-interaction |
| `components/ui/ContactModal.tsx` | Modal with contact form, shared state via React context |
| `components/home/HeroSection.tsx` | Asymmetric hero: left text + right constellation |
| `components/home/SkillConstellation.tsx` | Canvas-based interactive node graph |
| `components/home/BentoGrid.tsx` | Dashboard grid: about, stats, GitHub, tech, projects, blog, timeline, CTA tiles |
| `components/home/CareerTimeline.tsx` | Horizontal timeline with hover cards |
| `lib/contact-context.tsx` | React context for contact modal open/close state |
| `lib/github.ts` | Server-side GitHub API fetching + caching (stats, events, featured repos) |

### Modified files
| File | Changes |
|------|---------|
| `lib/constants.ts` | Add FEATURED_PROJECTS, CAREER_TIMELINE, SOCIAL_LINKS. Update NAV_ITEMS. Remove ROLES. |
| `app/globals.css` | New color tokens, tile styles, add font variables. Keep old cyber-card/cyber-button CSS until Task 12. |
| `app/layout.tsx` | Dual font setup (JetBrains Mono + Geist Sans), wrap with ContactModalProvider, update body class |
| `app/page.tsx` | Complete rewrite — HeroSection + BentoGrid |
| `app/projects/page.tsx` | Redesign with tile aesthetic, language filter pills, variable-height grid |
| `app/blog/page.tsx` | Redesign with tile aesthetic, featured hero post, 2-column grid |
| `app/resume/page.tsx` | Minor restyling with tile wrapper |
| `components/layout/Navbar.tsx` | Monospace logo, 3 nav items, Contact CTA button |
| `components/layout/Footer.tsx` | Simplify to thin bar with social icons |
| `next.config.ts` | Add 301 redirects for /about and /contact |
| `package.json` | Add `geist` dependency |
| `app/blog/[slug]/page.tsx` | Replace `variant="cyber"` Button, update `/contact` link to contact modal |
| `app/not-found.tsx` | Replace `variant="cyber"` Button |
| `app/error.tsx` | Replace `variant="cyber"` Button |
| `app/sitemap.ts` | Remove `/about` and `/contact` from sitemap entries |

### Deleted files
| File | Reason |
|------|--------|
| `app/about/page.tsx` | Absorbed into home bento grid |
| `app/contact/page.tsx` | Replaced by layout-level contact modal |
| `components/ui/GlitchText.tsx` | Glitch effect removed from design |
| `components/ui/TypewriterText.tsx` | Typewriter effect removed from design |

---

## Task 1: Foundation — Dependencies, Fonts, Config

**Files:**
- Modify: `package.json`
- Modify: `lib/constants.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.ts`

- [ ] **Step 1: Install geist font package**

```bash
npm install geist
```

- [ ] **Step 2: Update `lib/constants.ts` — add new constants, update NAV_ITEMS**

Add these new exports below existing ones:

```typescript
export const SOCIAL_LINKS = [
  { platform: "GitHub", url: OWNER_INFO.github, icon: "Github" },
  { platform: "LinkedIn", url: OWNER_INFO.linkedin, icon: "Linkedin" },
  { platform: "Email", url: `mailto:${OWNER_INFO.email}`, icon: "Mail" },
];

export const FEATURED_PROJECTS: string[] = ["semantic-cache", "next-portfolio"];

export const CAREER_TIMELINE = [
  { company: "Red Hat", role: "Technical Consultant", period: "2020–2022", color: "#39ff14" },
  { company: "D2iQ", role: "ML Engineer II", period: "2022–2023", color: "#b829dd" },
  { company: "Capital One", role: "Senior SWE", period: "2023–Present", color: "#00f0ff" },
];
```

Update `NAV_ITEMS`:

```typescript
export const NAV_ITEMS = [
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Resume", path: "/resume" },
];
```

**DO NOT remove `ROLES` yet** — it's still imported in `app/page.tsx` until Task 8 rewrites it. It will be removed in Task 8 Step 3 (cleanup of old imports).

- [ ] **Step 3: Rewrite `app/layout.tsx` — dual font system**

Replace Inter import with:

```tsx
import { JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
```

Create font instance:

```tsx
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-display",
});
```

Update `<body>` className:

```tsx
<body className={`${GeistSans.variable} ${jetbrainsMono.variable} font-sans`}>
```

Where `font-sans` maps to Geist Sans via Tailwind config.

- [ ] **Step 4: Rewrite `app/globals.css` — new design tokens and tile styles**

Replace the `@theme` section with updated colors (darker backgrounds: `#06060b` base), add font-family variables:

```css
@theme {
  --color-dark-900: #06060b;
  --color-dark-800: #0d0d12;
  /* ... keep other dark-* values ... */
  --color-surface: rgba(255,255,255,0.02);
  --color-surface-border: #1a1a1a;
  /* ... keep neon-* values ... */
  --font-sans: var(--font-geist-sans);
  --font-display: var(--font-display);
}
```

**DO NOT remove `.cyber-card`, `.cyber-button`, `.glitch`, or `@keyframes glitch*` CSS yet.** These are still used by pages that haven't been rewritten. They will be removed in Task 12 (Cleanup).

Add new `.tile` component class (alongside the old classes):

```css
.tile {
  @apply bg-[--color-surface] border border-[--color-surface-border] rounded-xl p-6;
  @apply transition-all duration-300 ease-out;
}
.tile:hover {
  @apply border-neon-cyan;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
  transform: scale(1.01);
}
```

Keep: `.gradient-text`, `.glow-line`, `.text-glow-*` utilities, `.blog-content` styles, scrollbar styles.

- [ ] **Step 5: Add redirects in `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 6: Verify build passes**

```bash
npm run build
```

Fix any import errors from removed ROLES constant.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: foundation — fonts, config, design tokens, redirects"
```

---

## Task 2: Contact Modal + Context

**Files:**
- Create: `lib/contact-context.tsx`
- Create: `components/ui/ContactModal.tsx`
- Modify: `app/layout.tsx` (wrap with provider)

- [ ] **Step 1: Create `lib/contact-context.tsx`**

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ContactContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContactContext = createContext<ContactContextType | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ContactContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
```

- [ ] **Step 2: Create `components/ui/ContactModal.tsx`**

Port the form from `app/contact/page.tsx` into a modal overlay. Key elements:
- Dark overlay backdrop with blur
- Centered modal with `.tile` styling
- Same form fields: name, email, subject, message
- Same submit handler posting to `/api/contact`
- Close on backdrop click, Escape key, or X button
- Framer Motion `AnimatePresence` for enter/exit animation

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useContactModal } from "@/lib/contact-context";

export default function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... handleChange, handleSubmit identical to current contact/page.tsx ...
  // On success: setIsSubmitted(true), after 3s close modal and reset

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="tile relative w-full max-w-lg z-10"
          >
            <button onClick={close} className="absolute top-4 right-4 text-dark-400 hover:text-neon-cyan">
              <X size={20} />
            </button>
            {/* Form content here — same fields as current contact page */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Wire into `app/layout.tsx`**

Import `ContactModalProvider` and `ContactModal`. Wrap children:

**IMPORTANT:** Do NOT add `'use client'` to `app/layout.tsx` — it remains a Server Component. The `ContactModalProvider` is a client component that accepts `children` as a prop, which preserves the server/client boundary.

```tsx
<ContactModalProvider>
  <Navbar />
  <main className="min-h-screen pt-16">{children}</main>
  <ContactModal />
  <Footer />
</ContactModalProvider>
```

- [ ] **Step 4: Verify modal opens/closes**

Start dev server, add a temporary button to test the modal opens, form submits, and closes properly.

```bash
npm run dev
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: contact modal with layout-level context"
```

---

## Task 3: Tile Component + Navbar + Footer

**Files:**
- Create: `components/ui/Tile.tsx`
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Create `components/ui/Tile.tsx`**

A reusable tile component replacing the old `Card`:

```tsx
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface TileProps extends HTMLAttributes<HTMLDivElement> {
  accent?: "cyan" | "purple" | "green" | "yellow" | "pink" | "orange";
}

const Tile = forwardRef<HTMLDivElement, TileProps>(
  ({ className, accent, children, ...props }, ref) => {
    const accentColors = {
      cyan: "hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
      purple: "hover:border-neon-purple hover:shadow-[0_0_20px_rgba(185,41,221,0.15)]",
      green: "hover:border-neon-green hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
      yellow: "hover:border-neon-yellow hover:shadow-[0_0_20px_rgba(255,240,31,0.15)]",
      pink: "hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,45,149,0.15)]",
      orange: "hover:border-neon-orange hover:shadow-[0_0_20px_rgba(255,107,53,0.15)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "tile",
          accent && accentColors[accent],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tile.displayName = "Tile";
export default Tile;
```

- [ ] **Step 2: Rewrite `components/layout/Navbar.tsx`**

Key changes:
- Logo: replace gradient "AJ" with monospace `aj>_` in cyan using `font-display`
- Nav items: 3 items from updated `NAV_ITEMS` (Projects, Blog, Resume)
- Add Contact CTA button that calls `useContactModal().open()`
- Keep: scroll detection, frosted glass, mobile hamburger, AnimatePresence

- [ ] **Step 3: Rewrite `components/layout/Footer.tsx`**

Simplify to thin bar:
- Glow-line separator at top
- Row: social icons (from `SOCIAL_LINKS`) | copyright | `// built with Next.js` in monospace
- Single row, no multi-column

- [ ] **Step 4: Verify nav and footer render correctly**

```bash
npm run dev
```

Check: logo links home, nav items work, Contact button opens modal, footer is thin.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: tile component, navbar, footer redesign"
```

---

## Task 4: GitHub Data Layer

**Files:**
- Create: `lib/github.ts`

- [ ] **Step 1: Create `lib/github.ts`**

Server-side functions for fetching GitHub data with caching:

```typescript
const GITHUB_USERNAME = "adityajariwala";
const CACHE_TTL = 3600; // 1 hour

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { next: { revalidate: CACHE_TTL } }),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, { next: { revalidate: CACHE_TTL } }),
  ]);

  const user = await userRes.json();
  const repos = await reposRes.json();

  const totalStars = Array.isArray(repos)
    ? repos.reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0)
    : 0;

  return { publicRepos: user.public_repos ?? 0, totalStars };
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`,
    { next: { revalidate: CACHE_TTL } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchFeaturedRepos(repoNames: string[]) {
  const repos = await Promise.all(
    repoNames.map(async (name) => {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${name}`,
        { next: { revalidate: CACHE_TTL } }
      );
      if (!res.ok) return null;
      return res.json();
    })
  );
  return repos.filter(Boolean);
}
```

- [ ] **Step 2: Verify data fetches work**

Temporarily call `fetchGitHubStats()` in a server component and log it, or write a quick test.

- [ ] **Step 3: Commit**

```bash
git add lib/github.ts
git commit -m "feat: GitHub data layer with server-side caching"
```

---

## Task 5: Skill Constellation (Canvas)

**Files:**
- Create: `components/home/SkillConstellation.tsx`

- [ ] **Step 1: Create `components/home/SkillConstellation.tsx`**

Canvas-based interactive node graph. Key behaviors:
- Reads nodes from `TECH_STACK` config — maps categories to colors (cyan/purple/green/yellow)
- Nodes positioned in a cluster on the right side of the canvas
- Each node: circle with text label, sized by number of items in category or flat sizes
- Connections: subtle lines between related nodes
- **Animation loop** via `requestAnimationFrame`:
  - Nodes drift on sine-wave paths (small amplitude, slow)
  - Cursor proximity within 150px creates gravitational pull toward mouse
  - Hovered node + connections brighten
  - Subtle parallax: entire field shifts slightly opposite to mouse position
- **Accessibility:** `prefers-reduced-motion` disables all animation, shows static nodes
- **Mobile:** renders static dots only (check `window.innerWidth < 768`, skip animation loop)
- **Performance:** Canvas resizes on window resize (debounced). Use `devicePixelRatio` for retina.

The component is `"use client"` and takes `className` prop for positioning.

This is the most complex component. Implement incrementally:
1. First: static nodes rendering on canvas
2. Then: drift animation
3. Then: cursor interaction (gravity + hover highlight)
4. Then: connection lines
5. Then: parallax

- [ ] **Step 2: Test rendering in isolation**

Temporarily render `<SkillConstellation />` on the home page to verify it draws nodes correctly.

- [ ] **Step 3: Commit**

```bash
git add components/home/SkillConstellation.tsx
git commit -m "feat: interactive skill constellation canvas component"
```

---

## Task 6: Hero Section

**Files:**
- Create: `components/home/HeroSection.tsx`

- [ ] **Step 1: Create `components/home/HeroSection.tsx`**

Asymmetric split layout:
- Uses CSS Grid: `grid-template-columns: 1fr 1fr` on desktop, single column on mobile
- **Left side** (text):
  - `// PORTFOLIO.SYS` — monospace tag in cyan, `font-display`, letter-spacing 3px
  - Name — 56px+, `font-display`, bold, tight letter-spacing (-2px), white
  - Role — 15px, cyan, subtle `text-shadow: 0 0 10px rgba(0,240,255,0.3)`
  - Tagline — 14px, muted gray (`#555`), 2 lines
  - CTA buttons — "Explore Work" (cyan outline) links to `#projects`, "Read Blog" links to `/blog`
  - Social links — small text links from `SOCIAL_LINKS`
  - All text uses Framer Motion `initial={{ opacity: 0, y: 20 }}` `animate={{ opacity: 1, y: 0 }}` with staggered delays
- **Right side**: `<SkillConstellation />` component
- **Scroll indicator**: bottom center, "Scroll" text + gradient line, bounce animation
- On mobile: single column, text centers, constellation becomes background

- [ ] **Step 2: Commit**

```bash
git add components/home/HeroSection.tsx
git commit -m "feat: asymmetric hero section with constellation"
```

---

## Task 7: Bento Grid + Career Timeline

**Files:**
- Create: `components/home/BentoGrid.tsx`
- Create: `components/home/CareerTimeline.tsx`

- [ ] **Step 1: Create `components/home/CareerTimeline.tsx`**

Horizontal timeline component:
- Maps `CAREER_TIMELINE` config to dots on a horizontal line
- Each dot: colored circle with company name below, period in monospace
- Gradient line connecting dots
- Hover: dot scales up, card appears above with role details
- Proper spacing: labels positioned below the line with enough gap, not overlapping
- Uses Framer Motion for hover card animation

- [ ] **Step 2: Create `components/home/BentoGrid.tsx`**

The main bento dashboard. This is a Server Component that fetches GitHub data:

```tsx
import { fetchGitHubStats, fetchGitHubEvents, fetchFeaturedRepos } from "@/lib/github";
import { OWNER_INFO, TECH_STACK, FEATURED_PROJECTS, CAREER_TIMELINE, SOCIAL_LINKS } from "@/lib/constants";
```

Grid layout using CSS Grid with named areas or explicit row/column spans:
- Row 1: About tile (rowspan 2) | Stats tile | GitHub tile
- Under Stats+GitHub: Tech Stack tile (colspan 2)
- Row 2: Featured Project 1 | Featured Project 2 | Latest Blog Post
- Row 3: Career Timeline (2fr) | Contact CTA (1fr)

Responsive: `grid-cols-1` on mobile, `md:grid-cols-2`, `lg:grid-cols-3`.

Each tile uses `<Tile>` component. Scroll animation: wrap each tile in a Framer Motion `motion.div` with `whileInView`, staggered `transition.delay` based on index.

The About tile, Stats tile, and GitHub tile contain static or server-fetched content.
The Featured Projects tiles use `fetchFeaturedRepos(FEATURED_PROJECTS)`.
The Latest Blog Post tile fetches from the existing blog API or imports `getSortedPosts()` from `lib/blog.ts`.
The Contact CTA tile needs `"use client"` for the `useContactModal` hook — extract it as a small client component `ContactCTATile`.

- [ ] **Step 3: Verify bento grid renders with real data**

```bash
npm run dev
```

Check: stats show real numbers, featured projects load, blog post appears, timeline renders.

- [ ] **Step 4: Commit**

```bash
git add components/home/BentoGrid.tsx components/home/CareerTimeline.tsx
git commit -m "feat: bento dashboard grid with career timeline"
```

---

## Task 8: Home Page Assembly

**Files:**
- Modify: `app/page.tsx`
- Delete: `app/about/page.tsx`
- Delete: `app/contact/page.tsx`
- Delete: `components/ui/GlitchText.tsx`
- Delete: `components/ui/TypewriterText.tsx`

- [ ] **Step 1: Rewrite `app/page.tsx`**

Replace entire file. The new home page is a Server Component (no `"use client"`):

```tsx
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BentoGrid />
    </div>
  );
}
```

- [ ] **Step 2: Delete removed files**

```bash
rm app/about/page.tsx
rm app/contact/page.tsx
rm components/ui/GlitchText.tsx
rm components/ui/TypewriterText.tsx
```

- [ ] **Step 3: Fix any remaining imports**

Search codebase for imports of deleted files or `ROLES` constant and remove them. Also remove `ROLES` export from `lib/constants.ts` (deferred from Task 1).

```bash
grep -r "GlitchText\|TypewriterText\|ROLES" --include="*.tsx" --include="*.ts" app/ components/ lib/
```

- [ ] **Step 4: Verify full home page works**

```bash
npm run dev
```

Navigate to `/` — hero section + bento grid should render. Navigate to `/about` — should redirect to `/#about`. Navigate to `/contact` — should redirect to `/#contact`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: assemble new home page, remove about/contact pages"
```

---

## Task 9: Projects Page Redesign

**Files:**
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Rewrite `app/projects/page.tsx`**

Key changes from current:
- Replace `Card` imports with `Tile`
- Add language filter bar: row of pill buttons derived from fetched repos' languages. "All" default. Active pill glows its language color (from `LANGUAGE_COLORS`).
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `auto-rows-auto` (cards size to content, no forced equal heights)
- Cards use `.tile` aesthetic: dark surface, subtle border, accent glow on hover
- Keep: existing fetch from `/api/projects`, loading/error/empty states
- Stagger animation: tiles animate in with `whileInView` and cascade delay
- Typography: page title uses `font-display`, descriptions use `font-sans`

- [ ] **Step 2: Verify projects page**

```bash
npm run dev
```

Navigate to `/projects`, test language filter, verify tile aesthetics match bento grid.

- [ ] **Step 3: Commit**

```bash
git add app/projects/page.tsx
git commit -m "feat: redesign projects page with tile aesthetic and language filter"
```

---

## Task 10: Blog Page Redesign

**Files:**
- Modify: `app/blog/page.tsx`

- [ ] **Step 1: Rewrite `app/blog/page.tsx`**

Key changes:
- Replace `Card` imports with `Tile`
- Featured post: first post gets a full-width hero tile at top (larger text, cover image if available)
- Remaining posts: `grid-cols-1 md:grid-cols-2` grid with tile styling
- Date and reading time in monospace (`font-display`) for terminal motif
- Keep: search bar, tag filter, existing data fetching
- Stagger animation on tiles

- [ ] **Step 2: Verify blog page**

```bash
npm run dev
```

Navigate to `/blog`, verify featured post hero, grid layout, search/filter still work.

- [ ] **Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: redesign blog page with featured hero post and tile grid"
```

---

## Task 11: Resume Page Restyling

**Files:**
- Modify: `app/resume/page.tsx`

- [ ] **Step 1: Restyle `app/resume/page.tsx`**

Minimal changes:
- Wrap PDF embed in a `<Tile>` component
- Page header uses `font-display` for title, gradient text
- Download button: replace `variant="cyber"` with cyan accent outline style (matching new CTA style)
- LinkedIn button: neutral outline

- [ ] **Step 2: Commit**

```bash
git add app/resume/page.tsx
git commit -m "feat: restyle resume page with tile wrapper"
```

---

## Task 12: Cleanup — Old CSS, Card, Button, Sitemap, Straggler Pages

**Files:**
- Modify: `app/globals.css` (remove old CSS classes)
- Modify: `components/ui/Card.tsx` (delete or update)
- Modify: `components/ui/Button.tsx` (remove `cyber` variant)
- Modify: `app/blog/[slug]/page.tsx` (replace `variant="cyber"`, update contact link)
- Modify: `app/not-found.tsx` (replace `variant="cyber"`)
- Modify: `app/error.tsx` (replace `variant="cyber"`)
- Modify: `app/sitemap.ts` (remove /about and /contact)

- [ ] **Step 1: Remove old CSS from `app/globals.css`**

Now that all pages have been rewritten, remove:
- `.cyber-card` and `.cyber-card:hover`
- `.cyber-button` and `.cyber-button:hover`
- `.glitch`, `.glitch::before`, `.glitch::after`
- `@keyframes glitch` and `@keyframes glitch-anim`

- [ ] **Step 2: Update `components/ui/Button.tsx`**

Remove `cyber` variant. Replace with a new `accent` variant:

```typescript
accent: "bg-transparent text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] font-medium px-6 py-3",
```

- [ ] **Step 3: Check if Card is still imported anywhere**

```bash
grep -r "from.*Card" --include="*.tsx" app/ components/
```

If `/blog/[slug]/page.tsx` uses it, update Card.tsx to use `.tile` class instead of `.cyber-card`. If nothing uses it, delete it.

- [ ] **Step 4: Fix `app/blog/[slug]/page.tsx`**

- Replace `variant="cyber"` with `variant="accent"` on any Button
- Replace `<Link href="/contact">` with a button that opens the contact modal (import `useContactModal`), or replace with `<Link href="/#contact">`

- [ ] **Step 5: Fix `app/not-found.tsx` and `app/error.tsx`**

Replace `variant="cyber"` with `variant="accent"` on all Buttons.

- [ ] **Step 6: Update `app/sitemap.ts`**

Remove `/about` and `/contact` from the static pages array.

- [ ] **Step 7: Full build check**

```bash
npm run build
```

Fix any remaining type errors or missing imports.

- [ ] **Step 8: Lint check**

```bash
npm run lint:fix
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: remove old CSS/components, fix button variants, update sitemap"
```

---

## Task 13: Final Polish — Animations + Responsive

**Files:**
- Various (cross-cutting)

- [ ] **Step 1: Verify scroll choreography**

Check all bento tiles stagger in correctly on scroll. Adjust delays if needed (50-100ms per tile).

- [ ] **Step 2: Verify mobile responsiveness**

Resize browser to mobile widths. Check:
- Hero: text centers, constellation shows static dots
- Bento grid: single column stacking
- Navbar: hamburger menu works
- Projects/Blog: single column
- Contact modal: fits mobile viewport

- [ ] **Step 3: Check `prefers-reduced-motion`**

In browser dev tools, enable "Reduce motion". Verify:
- Constellation is static
- No scroll animations
- Page transitions are instant

- [ ] **Step 4: Performance check**

Run Lighthouse or check that FCP/LCP aren't impacted by constellation canvas.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: animation polish, responsive fixes, accessibility"
```
