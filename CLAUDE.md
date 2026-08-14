# CLAUDE.md - axon011.github.io

## Project Overview

- **Project**: Personal portfolio / landing page for GitHub Pages
- **URL**: https://aravindpradee.me (custom domain) / https://axon011.github.io
- **Owner**: Aravind Pradeep (Junior AI Engineer)
- **Stack**: Vanilla HTML/CSS/JS, GitHub Pages
- **No build step** - static files served directly
- **Single self-contained file** - `index.html` holds ALL CSS (in a `<style>` block)
  and ALL JS (in an inline `<script>` at the end of `<body>`). There are no external
  stylesheets or scripts, and no Tailwind. The only remote assets are Google Fonts.

---

## File Structure

```
axon011.github.io/
├── index.html              # THE site — markup + all CSS + all JS, self-contained
├── Aravind_Pradeep_AI_Engineer.pdf  # Resume PDF (linked from nav + contact)
├── CNAME                   # Custom domain config (aravindpradee.me)
├── robots.txt              # Crawl rules
├── sitemap.xml             # Sitemap for SEO
├── design.md               # Reusable design-system templates (reference only)
├── reports/                # Historical frontend audit reports (point-in-time)
├── .claude/
│   └── skills/
│       └── frontend-engineer/
│           └── SKILL.md    # Frontend engineer skill for Claude Code
├── README.md               # Repo README
└── CLAUDE.md               # This file
```

> **Note (2026-08-14):** `css/style.css` and `js/script.js` were deleted. They had
> been orphaned since `index.html` was rewritten as a self-contained file — the page
> never loaded them. The `reports/` audits reference them; those are historical
> records of an older version of the site and are intentionally left as-is.

---

## Key Design Decisions

- **Single HTML file** - no framework, no build tools, no runtime dependencies
- **Two fonts**: Inter (body) + JetBrains Mono (code snippets)
- **CSS variables** for theming - light/dark mode via `html.dark` (NOT `[data-theme]`),
  persisted in `localStorage` under key `theme`
- **Static project cards** - hand-written in HTML. The GitHub API is no longer called;
  there is no rate-limit or 404-probe risk any more.
- **No contact form** - the contact section is a set of direct links (email, LinkedIn,
  GitHub, résumé). Formspree is gone.
- **Glassmorphic surfaces** over an aurora radial-gradient field (`body::before`)
- **Motion vocabulary** (added 2026-08-14, from the emil-design-eng ruleset):
  - `--ease-out: cubic-bezier(.23,1,.32,1)` is the single easing token — use it,
    don't invent parallel curves
  - Press feedback: `:active { transform: scale(.97) }` at 140ms on every pressable
  - Hover rules live in ONE `@media (hover:hover) and (pointer:fine)` block near the
    end of the `<style>` — never add a bare `:hover` inline, or touch devices get
    stuck hover states
  - `prefers-reduced-motion` means gentler, not zero: the block only kills `animation`
    and `transform`, never `opacity` or `display` (killing those hides content)

---

## Interactive Elements

| Feature | Location | How it works |
|---------|----------|-------------|
| Agent pipeline visual | Hero right column (`.viz-card`) | Static mock of a LangGraph run: 4 `.vnode` rows fading in on a 0/.9/1.8/2.7s stagger, `.vpulse` dots falling between them, whole card on a 7s `float` |
| Live-status pip | Hero eyebrow (`.pip`) | 2.4s opacity `pulse` |
| Scroll reveal | Sections with `.reveal` | Fade + 14px rise via IntersectionObserver adding `.in` |
| Staggered card reveal | `#projects` cards (`.sreveal`) | Same observer; per-card `cardin` keyframe, `--i` sets a 60ms column offset. Uses `backwards` fill ONLY, so the finished state releases `transform` back to the hover rule |
| Press feedback | All `.btn`, `.icon-btn`, `.cc`, `.card` | `:active` scale, 140ms `--ease-out` |
| Card hover lift | `#projects` cards | `translateY(-4px)` + gradient bar wipes in via `::before scaleX` |
| Active nav | Navbar links | `.on` class via IntersectionObserver, `-45%/-50%` rootMargin |
| Dark/light toggle | Navbar `#theme` | Both SVGs stacked in one grid cell; `.off` class cross-fades + rotates 90° over 180ms |

There is no typing effect, particle canvas, filter pills, contribution graph, scroll
progress bar, mobile menu, or back-to-top button. Those existed in an older version of
the site and were removed in the rewrite.

---

## Section Map

Sections are numbered 01-07 via `.sec-idx` in each `.sec-head`.

| Section ID | Description |
|-----------|-------------|
| `.hero` (`#top`) | Two-column: headline + lede + 3 CTAs + availability status, beside the `.viz-card` agent-pipeline visual. No section index. |
| `#about` | 01 — prose panel + 2×2 `.facts` grid (M.Sc., ~3 yrs, 2 yrs, 8 projects) |
| `#experience` | 02 — timeline, two positions (Perinet, Cognizant) |
| `#projects` | 03 — **8 hand-written** `.card` links, 2-col grid. Not API-driven. |
| `#skills` | 04 — 4 `.skill-card`s of `.chip` tags (AI & Agents, LLMOps, Programming, Infra) |
| `#education` | 05 — 2 `.mini` cards (M.Sc. BTU, B.Sc. BVM) |
| `#languages` | 06 — 3 `.lang` rows (English C1, German B1, Malayalam native) |
| `#contact` | 07 — prose + 4 `.cc` link tiles (email, LinkedIn, GitHub, résumé PDF) |

There is no `#github-stats` section.

---

## GitHub Username

The GitHub username `axon011` appears only in `index.html` now — the JSON-LD `sameAs`
block, the OG image URL, the hero GitHub button, the 8 project card `href`s, and the
contact tile. If the username changes, a single find-and-replace in `index.html` covers it.

---

## Companion Repo: axon011 (Profile README)

Located at `C:\Users\Aravind\Desktop\workspace\GIT\axon011\`
- Contains `README.md` displayed on the GitHub profile page
- Has badges linking to this portfolio site
- Shows GitHub stats cards (github-readme-stats, streak stats)
- Project table matching the resume

---

## Content Source

All content is based on the LaTeX resume (moderncv format). Key details:
- **Title**: Junior AI Engineer | Agentic Systems & RAG
- **Experience**: Perinet GmbH (Jun 2024-Present), Cognizant (Oct 2021-Aug 2022)
- **6 Projects**: Multi-Agent Pipeline, RAG Eval System, LLMOps Dashboard, GenAI Study Assistant, Commercial RAG Assistant, ViT Edge Optimization
- **Skills**: AI/Agents, LLMOps, Python/ML, Backend, Vector DBs, Cloud/DevOps, Frontend, Data
- **Education**: M.Sc. AI @ BTU Cottbus, B.Sc. CS @ BVM Holy Cross

---

## Known Issues (2026-08-14)

- [ ] Google Fonts is the only remote dependency; the page renders fine on the system
      font fallback if it's blocked, but headings reflow slightly
- [ ] `reports/` still cites `css/style.css` and `js/script.js` line numbers. Those
      files no longer exist — treat those reports as history, not as a live TODO list

---

## TODO

- [ ] Add favicon
- [ ] Add Open Graph image for social sharing previews
- [ ] Consider adding a blog section
