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
| Hero entrance | `h1.title .w`, `.strip/.lede/.hero-cta`, `.pc` | One-time on load: 7 headline words rise on a 45ms `--i` stagger (`wordin`), the copy fades up (`fadeup`). The project deck is already in place; it starts cycling once loaded |
| Project deck (hero, 2026-09-28) | `#hero-b` `.b-grid`: copy left, `#stack` right | Three card slots (`.pc`, `data-pos` 0 front / 1 right = next / 2 left = previous) over an 11-item deck (`DECK` in the page script: wind-farm, FUSION, Deutsch-Tutor, then the other 8 projects; copy from the project cards). Every 4.2s the right card comes forward and the slot leaving view is refilled (fade via `.swapping`), so every project comes round. Clicking a back card steps to it; arrow keys step; hover pauses and fans the back cards out (fan offsets tightened at 881-1220px so nothing crosses the viewport). The stack height is fixed once to the tallest of all 11 cards (hidden probe card), so the controls never shift. Below it `.deck-nav`: prev/next buttons, `01 / 11` counter and `#deck-scrub`, an 11-segment scrubber (role=slider): hovering shows a preview card (`#scrub-tip`) of the project under the pointer, clicking jumps, touch drag skims, Home/End work. Phones: tighter stack, back cards show edges only, horizontal swipe steps. Reduced motion: no autoplay |
| Living aurora | `body::before` + `body::after` | Four soft radial fields (`--aur1..4`, blue→violet→cyan) drifting via `aur-a` 96s / `aur-b` 124s (translate3d+scale+opacity only, `inset:-25%` hides edges). Loops attach only under `html.ready`; richer alphas in dark |
| Gradient ink | `h1.title em`, `.feat-metric .big`, `.sec-idx` | `--g1/--g2/--g3` per theme, AA-checked stops. The `em` animates `background-position` (`inkshift` 14s, `html.ready`-gated) inside `@supports (background-clip:text)` with solid-accent fallback |
| Per-project hues | Every `#projects` card (`style="--ph:<hue>"`) | `--pa`/`--pw` derived from `--ph` via `hsl()` (re-derived lighter in dark). Consumed by the wipe bar, spotlight, chevron, `.origin` rule, chip hover tint. Omitting `--ph` falls back to accent blue. Hues: 225 windfarm, 262 tutor, 200/210 GraphRAG×2, 265 multi-agent, 188 rag-eval, 172 llmops, 245 news, 252 finetune, 162 resume-tailor |
| Metric count-up | Featured card `.cu[data-to]` spans | On first reveal (existing IntersectionObserver), 900ms cubic ease-out counts €5.59M/€3.56M from 0; final string byte-identical to static text; reduced-motion lands instantly |
| Timeline draw-in | `#experience .tl::before` | Rests `scaleY(0)` origin-top; `.reveal.in` releases a 700ms `--ease-out` transition |
| Hero pointer glow | `.hero-glow` (z-index 0) | Pre-blurred radial gradient follows cursor via rAF-throttled translate3d; bound only when `(hover:hover) and (pointer:fine)` AND no reduced-motion; `pointer-events:none` |
| Personal strip | Hero, first line of the copy | One glass pill: pulsing `.pip` + "AI Engineer" + "Cottbus, Germany" + `.js-clock` (Intl.DateTimeFormat Europe/Berlin, 1s tick from `ready()`). The pill cannot wrap, so <=380px hides the clock and its separator |
| Scroll progress | `.nav::after` | 2px gradient bar, `scaleX(var(--p))`; `--p` set from a rAF-throttled passive scroll listener |
| Mobile menu | `#menu` + `.nav-links` (<=980px; seven links + actions no longer fit a row below that) | Bars/X icons cross-fade like the theme toggle; panel slides in 6px + fades. `aria-expanded`, Esc closes, link click closes |
| Scroll reveal | Sections with `.reveal` | Fade + rise via IntersectionObserver adding `.in` |
| Staggered card reveal | `#projects` cards (`.sreveal`) | Same observer; per-card `cardin` keyframe, `--i` sets a 60ms column offset. `backwards` fill ONLY, so the finished state releases `transform` back to the hover rule |
| Card spotlight | `.card::after` | motion-primitives Spotlight: radial `--accent-wash` at `--mx/--my`, fades in on hover. JS binds `pointermove` only when `(hover:hover) and (pointer:fine)` matches |
| Project "Details ▾" | `.exp-btn` + `.more` on every card | `.more{display:grid;grid-template-rows:0fr}` → `1fr` over 260ms; chevron rotates; `aria-expanded`/`aria-controls`. Cards are `<article>` with a stretched `.card-link::after`, so the button sits above the link (`z-index:1`) — no button-inside-anchor |
| Stack marquee | About `.a-stack .marquee` | 40s linear duplicated track, mask fade at both ends, paused on hover (gated), killed under reduced-motion. The one permitted ambient loop outside the hero |
| Show all projects | `#show-all` under `#proj-grid` | Grid opens with six cards; the last three carry `.extra` + `hidden`. The button toggles them, observes them for the stagger reveal, and scrolls back to `#projects` on collapse. `.proj-grid>.card:last-child:nth-child(odd)` spans both columns so nine cards never leave an empty cell |
| Skill map (Skills section) | `#skills .sm-panel`: `#sm-skills` chips grouped left, `#sm-projects` rows right, `#sm-links` SVG | Every chip from the project cards (33 tools, full lists, not the trimmed 4) linked to the projects that use it. Search (`#sm-q`) narrows chips; hover (fine pointers) or click pins a skill or project and draws curves from the skills column edge to the matching rows. One column (<=820px): no curves; tapping a skill opens an inline answer card (`.sm-answer`) under its group listing the projects, each scrolling to its row. Tools not on any card are answered by the search fallback and live in the toolkit below |
| Toolkit | `#toolkit` under the skill map | The 21 tools the old Skills cards listed that no project card names, in four labelled rows. Tools the Experience section names (Go, MQTT, Kubernetes, GitHub Actions, GitLab CI/CD from Perinet bullet 1; RAG from bullet 3) get a green dot and open `#tk-note` quoting that bullet with the tool highlighted and a link to `#experience`. Search matches light the chip (`.hit`). If you edit those Perinet bullets, update `WORK_LINES` in the skill-map script |
| Project pipelines | `.dgw` mount inside the Details panel of Multi-Agent, RAG Eval, News NLP, Resume Tailor | The approved prototype component: stage boxes, dashed animated links, travelling highlight (`st-live`/`ln-live`), Pause button. Stage data was verified against each GitHub repo on 2026-09-28. An open card with a diagram spans the full grid width (`:has()`), so the flow runs horizontally; a container query (`dg`, <=720px) switches it to vertical. Animates only while its Details panel is open |
| Press feedback | All `.btn`, `.icon-btn`, `.cc`, `.card` (.99), `.fact`, `.exp-btn`, `.copy`, `.sk`, `.tkc`, deck buttons | `:active` scale, 140ms `--ease-out` |
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
| `.hero` (`#top`) | `#hero-b`: copy (strip pill, headline, lede, 3 CTAs, availability status) beside the cycling project deck; one column <=880px. No section index. |
| `#about` | 01 - `.about` grid: `.a-lead` glass panel (3 bold-lead statements + footer line; no blur/focus reveal, removed 2026-09-28) beside `.a-side` (2x2 `.fact` tiles: M.Sc., ~3 yrs, 2 yrs, 10; then the stack marquee). One column <=880px |
| `#experience` | 02 - timeline with rail + dots, two positions (Perinet, Cognizant). Perinet bullet 1 names GitHub Actions and GitLab CI/CD; bullet 3 says "Owned RAG evaluation and model benchmarking" (both match the resume, 2026-09-28) |
| `#publications` | 03 - one-column glass card: First-author `.ftag` + DSD/arXiv meta, linked Fusion title, authors, `.pub-stats` row (48% energy, power-save setting / 1.58 pp recovered by staging / 31.8% fewer FLOPs for 0.09 pp), summary, `.pub-how` three steps (merge, exit early, prune; wording checked against the paper method section), `.pub-why` (1.62 pp parallel cost, one model for both settings), repro note, three buttons. No calibration claim: the thesis review found 3.4x drops to ~1.2x after temperature scaling |
| `#projects` | 04 — **10 hand-written** `<article class="card">`: one full-width `.feat` (Wind-Farm, 32px mono metric, `.ftag`) + 9 in the 2-col `.proj-grid` (first: Deutsch-Tutor — the only live app, so it leads the grid; its card-link goes to https://tutor.aravindpradee.me, not GitHub). Title + one-line pitch + metric + chips + Details ▾. Not API-driven. |
| `#skills` | 05 - the skill map and the toolkit (see Interactive Elements) |
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
