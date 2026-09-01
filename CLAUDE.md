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
- **Static project cards** - hand-written in HTML. The GitHub mark is a single
  `<symbol id="gh">` sprite at the top of `<body>`, referenced via `<use href="#gh">`. The GitHub API is no longer called;
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
| Hero entrance | `h1.title .w`, `.eyebrow/.lede/.hero-cta/.status/.hero-visual` | One-time on load: 7 headline words rise on a 45ms `--i` stagger (`wordin`), then the rest fades up in sequence (`fadeup`). `both` fill is safe here — nothing hovers on these |
| Live knowledge graph | Hero right column, `<canvas id="kg">` in `.viz-card` | 18 labelled nodes / 27 edges, seeded deterministic layout + light force sim, cursor attracts nodes on fine pointers, edges pulse, a packet dot travels a random edge. Reads `--ink/--muted/--accent/--bg/--line` and recolours on `html.class` change. rAF only while on screen and tab visible; single static frame under reduced-motion. `#kg-fallback` (static SVG) shows if canvas fails. `window.__kg.pause/resume` for tests |
| Border trail | `.viz-card::after` | motion-primitives BorderTrail, CSS-only: `@property --a` angle + conic-gradient masked to a 1.5px ring, 4.5s linear `orbit` |
| Live-status pip | Hero eyebrow (`.pip`) | 2.4s opacity `pulse` |
| Scroll progress | `.nav::after` | 2px gradient bar, `scaleX(var(--p))`; `--p` set from a rAF-throttled passive scroll listener |
| Mobile menu | `#menu` + `.nav-links` (≤860px) | Bars/X icons cross-fade like the theme toggle; panel slides in 6px + fades. `aria-expanded`, Esc closes, link click closes |
| Scroll reveal | Sections with `.reveal` | Fade + rise via IntersectionObserver adding `.in` |
| Staggered card reveal | `#projects` cards (`.sreveal`) | Same observer; per-card `cardin` keyframe, `--i` sets a 60ms column offset. `backwards` fill ONLY, so the finished state releases `transform` back to the hover rule |
| Card spotlight | `.card::after` | motion-primitives Spotlight: radial `--accent-wash` at `--mx/--my`, fades in on hover. JS binds `pointermove` only when `(hover:hover) and (pointer:fine)` matches |
| Project "Details ▾" | `.exp-btn` + `.more` on every card | `.more{display:grid;grid-template-rows:0fr}` → `1fr` over 260ms; chevron rotates; `aria-expanded`/`aria-controls`. Cards are `<article>` with a stretched `.card-link::after`, so the button sits above the link (`z-index:1`) — no button-inside-anchor |
| Stack marquee | About bento `.marquee` | 40s linear duplicated track, mask fade at both ends, paused on hover (gated), `animation:none` under reduced-motion. The one permitted ambient loop outside the hero |
| Press feedback | All `.btn`, `.icon-btn`, `.cc`, `.card`, `.fact`, `.exp-btn`, `.copy` | `:active` scale, 140ms `--ease-out` |
| Card hover lift | `#projects` cards | `translateY(var(--lift,-4px))` + gradient bar wipes in via `::before scaleX`; reduced-motion sets `--lift:0px` |
| Timeline rail | `#experience .tl` | 1px gradient rail + 11px dots per `.job`; first job gets the accent ring |
| Copy email | `#copy-email` inline after the email headline in `#contact` | Clipboard API; copy→check icon cross-fade, tooltip "Copied", resets after 1.4s |
| Active nav | Navbar links | `.on` class via IntersectionObserver, `-45%/-50%` rootMargin |
| Dark/light toggle | Navbar `#theme` | Both SVGs stacked in one grid cell; `.off` class cross-fades + rotates 90° over 180ms. With `document.startViewTransition` (and no reduced-motion) the swap is a circular clip-path reveal from the toggle (`--tx/--ty`) |

There is no typing effect, particle canvas, filter pills, contribution graph, or
back-to-top button. Those existed in an older version of the site and were removed.

**Type scale (2026-08-23 redesign):** `--fs-body:17px`, `--fs-lede:clamp(19px,2.3vw,22px)`,
`--fs-h1:clamp(44px,7.2vw,84px)`, `--fs-sec:clamp(28px,3.4vw,36px)`, `--fs-card:19px`,
`--maxw:1120px`, `section.block{padding:84px 0}`. Copy is deliberately terse: one-sentence
lede, three-statement About, one-line project pitches — long text lives behind "Details ▾".

---

## Section Map

Sections are numbered 01-07 via `.sec-idx` in each `.sec-head`. Alternating sections
(02 Experience, 04 Projects, 06 Education) carry `class="band"` — a full-bleed `--band`
tint via `::before{inset:0 calc(50% - 50vw)}` with its own 1px top/bottom rules (the
banded section and its follower drop `border-top` to avoid doubling). `html` carries
`overflow-x:clip` (NOT hidden — hidden would break the sticky nav; and on `body` alone
clip does not reach the viewport) to trim the band's half-scrollbar overhang.

| Section ID | Description |
|-----------|-------------|
| `.hero` (`#top`) | Two-column: headline + lede + 3 CTAs + availability status, beside the `.viz-card` agent-pipeline visual. No section index. |
| `#about` | 01 — bento: `lead` panel (3 bold-lead statements + footer line), 4 glass `.fact` tiles (M.Sc., ~3 yrs, 2 yrs, 9), full-width `.marquee` of the stack. `grid-template-areas`, 4→2→1 cols at 880/560 |
| `#experience` | 02 — timeline with rail + dots, two positions (Perinet, Cognizant) |
| `#publications` | 03 — one glass panel: First-author `.ftag`, arXiv:2607.02612 meta line, linked title (Fusion), authors, one-paragraph summary, `.metric` chip (48% energy · 4× calibration), Read-on-arXiv button |
| `#projects` | 04 — **9 hand-written** `<article class="card">`: one full-width `.feat` (Wind-Farm, 32px mono metric, `.ftag`) + 8 in the 2-col `.proj-grid`. Title + one-line pitch + metric + chips + Details ▾. Not API-driven. |
| `#skills` | 05 — symmetric 2×2 of equal `.skill-card`s (AI & Agents, LLMOps, Programming, Infra) |
| `#education` | 06 — 2 `.mini` cards (M.Sc. BTU with language chips English C1 · German B1 · Malayalam, B.Sc. BVM) |
| `#contact` | 07 — email as 24–28px headline + inline copy button, then 3 `.cc` tiles (LinkedIn, GitHub, résumé PDF) |

There is no `#github-stats` or `#languages` section (languages moved into Education).

---

## GitHub Username

The GitHub username `axon011` appears only in `index.html` now — the JSON-LD `sameAs`
block, the OG image URL, the hero GitHub button, the 9 project card `href`s, the
contact tile, and the footer source link. If the username changes, a single find-and-replace in `index.html` covers it.

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

- [ ] Navbar overflows ~36px at a 320px viewport (pre-dates the Publications nav link;
      affects only very small devices). Not a regression — fix opportunistically
- [ ] Google Fonts is the only remote dependency; the page renders fine on the system
      font fallback if it's blocked, but headings reflow slightly
- [ ] `reports/` still cites `css/style.css` and `js/script.js` line numbers. Those
      files no longer exist — treat those reports as history, not as a live TODO list

---

## TODO

- [ ] Add favicon
- [ ] Add Open Graph image for social sharing previews
- [ ] Consider adding a blog section
