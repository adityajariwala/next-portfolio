# Portfolio Redesign — "Cinematic + Dashboard" Hybrid

**Date:** 2026-03-19
**Status:** Approved

## Overview

A next-gen refresh of adityajariwala.com that elevates the existing cyberpunk identity with refined execution. The redesign consolidates 6 pages into 4, introduces data visualization as a core identity element, adds micro-interactions throughout, and replaces predictable layouts with asymmetric, bento-grid compositions.

## Audience & Goals

- **Primary audience:** Engineering peers and open-source community — people who appreciate technical depth, craft, and design taste
- **Secondary audience:** Potential collaborators — the site should make it easy to understand capabilities and reach out
- **Not optimizing for:** Recruiters (not currently job-seeking)

## Design Direction: Refined Cyberpunk

Same DNA, elevated execution. Neon accents become surgical highlights, not a flood. Monospace details and terminal motifs add engineering personality. The glow is earned, not everywhere.

### What changes from current site:
- Neon is restrained — used as accent, not applied to every heading and border
- Layout breaks symmetry — asymmetric hero, bento grids, varied card sizes
- Animations are choreographed — staggered scroll reveals replace uniform fade-up
- Interactivity rewards curiosity — cursor-reactive elements, hover reveals, magnetic effects
- Typography has character — monospace + geometric sans pairing replaces generic Inter

### What stays:
- Dark theme (near-black backgrounds)
- Neon color palette (cyan primary, purple/pink/green secondary)
- Framer Motion for animations
- Config-driven architecture via `lib/constants.ts`

## Site Structure

4 routes (down from 6). About and Contact absorbed into Home.

| Route | Purpose |
|-------|---------|
| `/` | Rich scrollable showcase — hero, about, skills, projects, blog, contact |
| `/projects` | Full project grid with filters |
| `/blog` | Blog listing with search and tag filter |
| `/resume` | PDF embed + download |

Navigation: Logo (home) · Projects · Blog · Resume · Contact (small CTA button)

**Removed routes:** `/about` and `/contact` are removed. Add 301 redirects: `/about` → `/#about`, `/contact` → `/#contact` (for SEO and existing bookmarks).

## Page Designs

### Home Page (`/`)

#### Hero Section — Asymmetric Split
- **Layout:** Text anchored left (~50% width), skill constellation floating right
- **Left side:**
  - Monospace tag: `// PORTFOLIO.SYS` in cyan, letter-spaced
  - Name: Large (56px+), bold, tight letter-spacing. No glitch effect — clean and confident
  - Role: `Senior Software Engineer at Capital One` in cyan with subtle text-shadow glow
  - Tagline: 2 lines in muted gray, describing what you build
  - Two CTA buttons: "Explore Work" (cyan accent outline) and "Read Blog" (neutral outline)
  - Social links: GitHub, LinkedIn, Email — small, understated text links
- **Right side:** Interactive skill constellation
  - Force-directed or positioned node graph
  - Nodes = technologies, sized by proficiency/relevance
  - Color-coded by category: cyan (infra), purple (ML/AI), green (languages), yellow (frontend)
  - Nodes connected by subtle lines showing relationships
  - **Interactions:** Nodes drift slowly. Cursor proximity creates gravitational pull (nodes attract toward cursor). Hover a node to brighten it and its connections, revealing related projects in a tooltip. Entire constellation responds to mouse movement for parallax depth.
  - On mobile: constellation becomes a static decorative background, text centers
- **Scroll indicator:** Minimal — small "Scroll" text + thin gradient line, bottom center

#### Bento Dashboard Grid
Scroll-triggered entrance — tiles stagger in with cascade delay (left-to-right, top-to-bottom).

**Row 1** (3-column: 1.8fr 1fr 1fr):
- **About tile** (tall, spans 2 rows): Avatar/initials, name, company, location. Condensed bio (3-4 sentences). Experience company tags at bottom (Capital One, D2iQ, Red Hat).
- **Stats tile:** Key metrics fetched from GitHub API (server-side, cached). Values: public repo count, total stars across repos, and years of experience (static from config). These are dynamic where possible — the GitHub API `/users/{username}` and `/users/{username}/repos` endpoints provide repo count and star counts. Cache on the server with ISR or a short revalidation window.
- **GitHub Activity tile:** Recent commit activity sparkline (from GitHub Events API: `GET /users/{username}/events?per_page=30`). The full contribution heatmap requires GitHub GraphQL API which needs authentication — defer to a simpler "recent activity" visualization using the public Events API. Shows repo count. Links to GitHub profile.

**Row 1 continued** (spans under Stats + GitHub):
- **Tech Stack tile** (spans 2 columns): Horizontally-wrapped tech tags. Each tag has its category accent color as a subtle border and background tint. Hover intensifies glow. `+N more` overflow indicator. Tags are interactive — hover reveals category label.

**Row 2** (3-column equal):
- **Featured Project 1:** Project name, one-line description, language dot + star count. Subtle radial gradient accent in corner. Links to GitHub.
- **Featured Project 2:** Same layout. Config-driven — which projects are featured should be configurable.
- **Latest Blog Post:** Title, excerpt, "Read →" link. Same tile treatment as projects.

**Row 3** (2-column: 2fr 1fr):
- **Career Timeline:** Horizontal timeline with colored dots per role (Red Hat → D2iQ → Capital One → Next?). Gradient line connecting them. Hover dots to reveal role details in a card above. Proper spacing so labels don't overlap the line.
- **Contact CTA:** Gradient-tinted tile. "Let's build together" heading, "Open to collaboration" subtext, "Get in Touch" button. Clicking opens a **contact modal** with the existing form (name, email, subject, message) that submits to `/api/contact`. The modal works from any page — it's rendered at the layout level and triggered via a shared state/context. This replaces the dedicated `/contact` page.

**Tile interactions (global):**
- Magnetic hover: tiles translate slightly toward cursor on hover
- Border glow: border brightens to accent color on hover
- Subtle scale: 1.01-1.02x scale on hover
- All transitions: 200-300ms ease-out

### Projects Page (`/projects`)

- **Header:** "Projects" gradient text heading + subtitle
- **Filter bar:** Language pill buttons that glow their language color when active. "All" default.
- **Grid:** CSS Grid with `auto-rows` allowing variable card heights based on content. Use a 3-column grid where cards naturally vary in height (no forced equal heights). Not a true masonry layout (avoiding extra dependencies) — just cards that size to their content within grid columns.
- **Cards:** Same tile aesthetic as bento grid — dark background, subtle border, accent glow on hover. Show: repo name, description (line-clamp-3), language dot, stars, forks, topics (max 3 tags), GitHub link + live site link.
- **Loading/Error/Empty states:** Styled to match — spinner in cyan, error in pink
- **Data source:** Keep existing GitHub API integration via `/api/projects`

### Blog Page (`/blog`)

- **Header:** "Blog" gradient text heading + subtitle
- **Search + Filter:** Keep existing search bar and tag filter dropdown. Style to match dark tile aesthetic.
- **Featured post:** Latest/featured post gets a larger hero card spanning full width at top
- **Grid:** Remaining posts in 2-column grid below. Cards match tile aesthetic.
- **Card details:** Title, excerpt, date (monospace), reading time (monospace), tags. Cover image if available.
- **Data source:** Keep existing markdown + gray-matter pipeline

### Resume Page (`/resume`)

- Minimal changes. PDF embed in a dark tile wrapper.
- Download button (cyan accent) and LinkedIn button (neutral)
- Same page header treatment as other pages

## Layout Components

### Navbar
- Fixed, transparent → frosted glass on scroll (keep current behavior)
- Logo: Monospace treatment — `aj>_` or `aditya.` — replaces gradient "AJ"
- Nav items: Projects · Blog · Resume (3 items, no "Home" — logo click = home)
- Contact CTA: Small accent-outlined button in nav. Opens the contact modal (same modal as the home CTA tile — rendered at layout level, accessible from any page).
- Mobile: Hamburger menu with slide-down panel (keep current AnimatePresence behavior)

### Footer
- Simplified to a thin bar
- Content: Social icon row (GitHub, LinkedIn, Email) · Copyright · `// built with Next.js` monospace tag
- No navigation links or multi-column layout
- Thin glow-line separator at top

## Design Tokens

### Typography
- **Display / Headings:** JetBrains Mono (monospace with character). Used for page titles, section labels, stat numbers, and terminal-motif elements like `// PORTFOLIO.SYS`.
- **Body:** Geist Sans (clean geometric sans). Used for paragraphs, descriptions, nav items, and general UI text.
- **Code / Labels:** Same monospace as display, but at smaller sizes for inline code, dates, tag labels.
- Load via `next/font` for zero layout shift.

**Font setup in `app/layout.tsx`:**
```tsx
import { JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-display",
});

// Apply to <body>:
// className={`${GeistSans.variable} ${jetbrainsMono.variable}`}
//
// In Tailwind/CSS:
// --font-body: var(--font-geist-sans);
// --font-display: var(--font-display);  (from JetBrains Mono)
//
// Usage: font-family: var(--font-display) for headings/labels
//        font-family: var(--font-body) for body text
```

### Color Palette (evolved from current — slightly darker backgrounds, same accents, different application)
- **Background:** `#06060b` to `#0d0d12` (slightly darker than current)
- **Surface:** `rgba(255,255,255,0.02)` with `#1a1a1a` borders (tile backgrounds)
- **Primary accent:** `#00f0ff` (neon cyan) — used sparingly for emphasis, CTAs, and primary interactive elements
- **Secondary accents:** `#b829dd` (purple), `#39ff14` (green), `#fff01f` (yellow), `#ff6b35` (orange), `#ff2d95` (pink)
- **Text:** `#f0f0f0` (headings), `#888` (body), `#555` (muted), `#333` (subtle)
- **Glow guideline:** Prefer one prominent glow per viewport. Glow is triggered by interaction (hover/focus), not static. This is a design guideline, not a programmatic constraint — use judgment during implementation.

### Motion System
- **Scroll choreography:** Bento tiles stagger in with cascade delay (50-100ms per tile). Use `whileInView` with `once: true`. No more identical fade-up on every section.
- **Micro-interactions:** Magnetic hover on tiles (CSS transform: translate toward cursor position). Glow intensification on hover (border-color + box-shadow transition). Tech tags pulse their accent color on hover.
- **Hero constellation:** HTML5 Canvas-based (for performance with many moving nodes). Nodes drift on subtle sine-wave paths. Cursor proximity within ~150px radius creates gravitational pull. Connections (lines between nodes) brighten when either connected node is hovered. Entire field has subtle parallax on mouse move. Implement as a custom `<SkillConstellation>` component using `requestAnimationFrame` — no external library needed. The node positions, sizes, and colors are derived from `TECH_STACK` in constants. Keep the interaction set to: drift, cursor gravity, hover highlight, and parallax. Tooltips showing related projects are a stretch goal — defer if it adds significant complexity.
- **Page transitions:** `AnimatePresence` with opacity + subtle y-translate between routes.
- **Performance:** All animations use `transform` and `opacity` only (GPU-composited). Constellation uses `requestAnimationFrame`. Respect `prefers-reduced-motion`.

## Config Architecture

Keep `lib/constants.ts` as the single source of truth. Restructure to better match the tile-based layout:

```typescript
// KEEP as-is: OWNER_INFO, EXPERIENCE, SKILLS, TECH_STACK, LANGUAGE_COLORS

// UPDATE:
// NAV_ITEMS → reduce to 3: [{ name: "Projects", path: "/projects" }, { name: "Blog", path: "/blog" }, { name: "Resume", path: "/resume" }]

// DEPRECATE (no longer used):
// ROLES → typewriter effect removed; role is now a static line in the hero

// KEEP but may not surface in new design:
// EDUCATION → not shown in bento grid. Keep in constants for potential future use (e.g., tooltip or expandable about section). Not deleted.

// ADD:
// FEATURED_PROJECTS: string[] — GitHub repo names to feature on home bento grid.
//   e.g., ["semantic-cache", "next-portfolio"]. Metadata (description, stars, language) fetched from GitHub API at runtime.

// CAREER_TIMELINE: { company: string; role: string; period: string; color: string }[]
//   Simplified from EXPERIENCE for the horizontal timeline dots. e.g.:
//   [{ company: "Red Hat", role: "Technical Consultant", period: "2020-2022", color: "#39ff14" }, ...]

// SOCIAL_LINKS: { platform: string; url: string; icon: string }[]
//   Extracted from OWNER_INFO for reuse in hero, footer, and contact modal.
```

## Technical Considerations

- **Next.js 16** with App Router (already in use)
- **Tailwind CSS v4** (already in use)
- **Framer Motion** for all animations (already in use)
- **Canvas or SVG** for hero constellation — SVG for accessibility, Canvas if performance requires it
- **GitHub API** for projects and stats — consider server-side caching to avoid rate limits
- **Responsive:** Mobile-first using Tailwind default breakpoints (`sm:640px`, `md:768px`, `lg:1024px`). Bento grid: 1 column on mobile, 2 columns at `md`, full 3-column layout at `lg`. Hero constellation becomes static decorative dots on mobile (no animation, no interaction). All tiles stack vertically on mobile.
- **Performance budget:** Hero constellation must not impact FCP/LCP. Lazy-load below-fold tiles. Use `will-change` sparingly.
- **Accessibility:** All interactive elements keyboard-navigable. Constellation nodes accessible via tab. `prefers-reduced-motion` disables constellation animation and scroll choreography.

## Out of Scope

- No changes to blog post rendering (`/blog/[slug]`)
- No changes to API routes (`/api/contact`, `/api/projects`, `/api/blog`)
- No changes to SEO metadata structure (just update content as needed)
- No new runtime dependencies — constellation is custom Canvas code, no external animation/graph library
- New font dependency: `geist` package for Geist Sans (install via npm)
