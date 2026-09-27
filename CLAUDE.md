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
  persisted in `localStorage` under key `theme`. A tiny boot script in `<head>` applies the
  class before first paint (no light flash for dark visitors); the page script also sets `html.light`
  so the `prefers-color-scheme` CSS fallback never fights an explicit choice. All storage access is
  wrapped in try/catch (private mode / blocked storage used to throw and kill the whole script)
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
| Hero entrance | `h1.title .w`, `.strip/.lede/.hero-cta`, `.tile` | One-time on load: 7 headline words rise on a 45ms `--i` stagger (`wordin`), the copy fades up (`fadeup`), then the four bento tiles fade up on an 80ms `--d` stagger starting at .45s. The wind-farm bars grow in (`grow`, scaleX) at .8s |
| Proof bento (hero, 2026-09-27) | `.bento` of four `.tile`s right of the copy | Paper tile (48% + label + full FUSION title → `#publications`), wind-farm tile (€5.59M → €3.56M + 189/64-day bars drawn to scale, 64/189 = 33.9% → `#projects`), Deutsch-Tutor live-app tile (→ tutor.aravindpradee.me), availability tile (status + 0.94 hit@5). Per-tile hue via `--ph` like the project cards. 2 cols → 1 col at ≤520px. Replaced the full-bleed knowledge-graph canvas, which collapsed to a thin dot strip below 880px (every phone) so the hero read as plain text; the graph code lives in git history before this commit |
| Living aurora | `body::before` + `body::after` | Four soft radial fields (`--aur1..4`, blue→violet→cyan) drifting via `aur-a` 96s / `aur-b` 124s (translate3d+scale+opacity only, `inset:-25%` hides edges). Loops attach only under `html.ready`; richer alphas in dark |
| Gradient ink | `h1.title em`, `.feat-metric .big`, `.sec-idx` | `--g1/--g2/--g3` per theme, AA-checked stops. The `em` animates `background-position` (`inkshift` 14s, `html.ready`-gated) inside `@supports (background-clip:text)` with solid-accent fallback |
| Per-project hues | Every `#projects` card (`style="--ph:<hue>"`) | `--pa`/`--pw` derived from `--ph` via `hsl()` (re-derived lighter in dark). Consumed by the wipe bar, spotlight, chevron, `.origin` rule, chip hover tint. Omitting `--ph` falls back to accent blue. Hues: 225 windfarm, 262 tutor, 200/210 GraphRAG×2, 265 multi-agent, 188 rag-eval, 172 llmops, 245 news, 252 finetune, 162 resume-tailor |
| Metric count-up | Featured card `.cu[data-to]` spans | On first reveal (existing IntersectionObserver), 900ms cubic ease-out counts €5.59M/€3.56M from 0; final string byte-identical to static text; reduced-motion lands instantly |
| Timeline draw-in | `#experience .tl::before` | Rests `scaleY(0)` origin-top; `.reveal.in` releases a 700ms `--ease-out` transition |
| Hero pointer glow | `.hero-glow` (z-index 0) | Pre-blurred radial gradient follows cursor via rAF-throttled translate3d; bound only when `(hover:hover) and (pointer:fine)` AND no reduced-motion; `pointer-events:none` |
| Personal strip | Hero, first line of the copy | One glass pill: pulsing `.pip` + "AI Engineer" + "Cottbus, Germany" + `#berlin-clock` (Intl.DateTimeFormat Europe/Berlin, 1s tick from `ready()`). Replaced the separate eyebrow and the avatar (it was GitHub's default identicon and read as a broken image). The pill cannot wrap, so ≤380px hides the clock and its separator |
| Scroll progress | `.nav::after` | 2px gradient bar, `scaleX(var(--p))`; `--p` set from a rAF-throttled passive scroll listener |
| Mobile menu | `#menu` + `.nav-links` (≤860px) | Bars/X icons cross-fade like the theme toggle; panel slides in 6px + fades. `aria-expanded`, Esc closes, link click closes |
| Scroll reveal | Sections with `.reveal` | Fade + rise via IntersectionObserver adding `.in` |
| Staggered card reveal | `#projects` cards (`.sreveal`) | Same observer; per-card `cardin` keyframe, `--i` sets a 60ms column offset. `backwards` fill ONLY, so the finished state releases `transform` back to the hover rule |
| Card spotlight | `.card::after` | motion-primitives Spotlight: radial `--accent-wash` at `--mx/--my`, fades in on hover. JS binds `pointermove` only when `(hover:hover) and (pointer:fine)` matches |
| Project "Details ▾" | `.exp-btn` + `.more` on every card | `.more{display:grid;grid-template-rows:0fr}` → `1fr` over 260ms; chevron rotates; `aria-expanded`/`aria-controls`. Cards are `<article>` with a stretched `.card-link::after`, so the button sits above the link (`z-index:1`) — no button-inside-anchor |
| Stack marquee | About `.a-stack .marquee` | 40s linear duplicated track, mask fade at both ends, paused on hover (gated), killed under reduced-motion. The one permitted ambient loop outside the hero |
| Focus reveal | About `.stmt.fx` (the three statements only) | Words are wrapped in `.w` spans at runtime and grouped by visual line; lines below a reading line at 62% of the viewport get up to 6px blur and 28% opacity, sharpening as they rise to it, and each statement scales from .96 to 1. Lines above stay sharp. Re-measured on resize, font load and layout changes (`fxMeasure`). Entirely off under reduced motion |
| Show all projects | `#show-all` under `#proj-grid` | Grid opens with six cards; the last three carry `.extra` + `hidden`. The button toggles them, observes them for the stagger reveal, and scrolls back to `#projects` on collapse. `.proj-grid>.card:last-child:nth-child(odd)` spans both columns so nine cards never leave an empty cell |
| Press feedback | All `.btn`, `.icon-btn`, `.cc`, `.card` (.99), `.fact`, `.exp-btn`, `.copy`, `.tile` (.98) | `:active` scale, 140ms `--ease-out` |
| Card hover lift | `#projects` cards | `translateY(var(--lift,-4px))` + gradient bar wipes in via `::before scaleX`; reduced-motion sets `--lift:0px` |
| Timeline rail | `#experience .tl` | 1px gradient rail + 11px dots per `.job`; first job gets the accent ring |
| Copy email | `#copy-email` inline after the email headline in `#contact` | Clipboard API; copy→check icon cross-fade, tooltip "Copied", resets after 1.4s |
| Active nav | Navbar links | `.on` class via IntersectionObserver, `-45%/-50%` rootMargin |
| Dark/light toggle | Navbar `#theme` | Both SVGs stacked in one grid cell; `.off` class cross-fades + rotates 90° over 180ms. With `document.startViewTransition` (and no reduced-motion) the swap is a circular clip-path reveal from the toggle (`--tx/--ty`) |

There is no typing effect, particle canvas, filter pills, contribution graph, or
back-to-top button. Those existed in an older version of the site and were removed.

**Type scale (2026-09-27 redesign): seven steps, nothing in between.** `--t-xs:12px`, `--t-sm:14px`, `--t-md:17px` (body),
`--t-lg:20px`, `--t-xl:clamp(21px,2.3vw,25px)` (lede, About statements), `--t-2xl:clamp(30px,3.6vw,42px)` (section titles),
`--t-hero:clamp(46px,7.6vw,92px)` (hero h1 overrides to `clamp(44px,6.6vw,84px)` beside the bento). Body copy uses `--body`
(#30333c light / #c9ccd5 dark), darker than `--muted`. **Three radii:** `--r-sm:8px`, `--r-md:12px`, `--r-lg:22px`.
`--maxw:1160px`, `section.block{padding:92px 0}` (64px ≤560). No em dashes in visible copy. Copy stays terse: one-sentence
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
| `.hero` (`#top`) | Two columns: copy (strip pill, headline, lede, 3 CTAs) and the proof bento; one column ≤880px (hero padding 56/64). No section index. |
| `#about` | 01 — `.about` grid: `.a-lead` glass panel (3 bold-lead statements with the focus reveal + footer line) beside `.a-side` (2×2 `.fact` tiles: M.Sc., ~3 yrs, 2 yrs, 10; then the full-width stack marquee). One column ≤880px, facts stay 2×2 |
| `#experience` | 02 — timeline with rail + dots, two positions (Perinet, Cognizant) |
| `#publications` | 03 — one glass panel: First-author `.ftag`, arXiv:2607.02612 meta line, linked title (Fusion), authors, one-paragraph summary, `.metric` chip (48% energy · 4× calibration), Read-on-arXiv button |
| `#projects` | 04 — **10 hand-written** `<article class="card">`: one full-width `.feat` (Wind-Farm, 32px mono metric, `.ftag`) + 9 in the 2-col `.proj-grid` (first: Deutsch-Tutor — the only live app, so it leads the grid; its card-link goes to https://tutor.aravindpradee.me, not GitHub). Title + one-line pitch + metric + chips + Details ▾. Not API-driven. |
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

- [x] ~~Navbar overflows ~36px at a 320px viewport~~ — fixed 2026-09-01. The brand plus
      three actions needed 374px of a 320px row, and `html{overflow-x:clip}` cut the
      Résumé button in half with no scrollbar to reveal it. Two media queries after the
      860px block reclaim it: `≤380px` tightens `.nav-in` padding (18→14) and gap (16→10),
      `.brand` (15→14px), `.nav-actions` gap (10→8) and the Résumé button (13px type,
      9/12 padding); `≤359px` swaps the visible label to "CV" via `.cv-long`/`.cv-short`,
      with `aria-label="Résumé (PDF)"` on the anchor keeping the accessible name intact.
      Verified zero overflow at 320/360/375/768/1440 in both themes
- [ ] Google Fonts is the only remote dependency; the page renders fine on the system
      font fallback if it's blocked, but headings reflow slightly
- [ ] `reports/` still cites `css/style.css` and `js/script.js` line numbers. Those
      files no longer exist — treat those reports as history, not as a live TODO list

---

## TODO

- [x] ~~Add favicon~~ — `favicon.svg` + `favicon.ico` (16/32/48) + `apple-touch-icon.png`
      (180×180, full-bleed, iOS rounds the corners itself) added 2026-09-04, replacing the
      inline data-URI icon that depended on an installed Inter/Arial. The mark is a white
      "A" drawn as paths (no font dependency) on an accent-gradient rounded tile — chosen
      over a 3-node graph motif because only the letterform stays legible at 16px.
      `favicon.svg` is the source: regenerate the raster pair by rendering it at 16/32/48
      and 180 in headless Chromium, then assembling the .ico with Pillow
- [x] ~~Add Open Graph image for social sharing previews~~ — `og.png` added 2026-09-01
      (1200×630, 73KB indexed PNG). Wired to `og:image` + `twitter:image`, with
      `twitter:card` raised to `summary_large_image`. It is a rendered artwork, not a
      source file: regenerate by re-rendering the throwaway `og-src.html` recipe rather
      than editing the PNG. The JSON-LD `"image"` stays the GitHub avatar — schema.org
      wants a photo of the person there, not a share card
- [ ] Consider adding a blog section
