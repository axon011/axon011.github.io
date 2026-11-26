# CLAUDE.md - axon011.github.io

## Project Overview

- **Project**: Personal portfolio for GitHub Pages, aimed at AI Engineer roles in Germany
- **URL**: https://aravindpradee.me (custom domain) / https://axon011.github.io
- **Owner**: Aravind Pradeep (AI Engineer)
- **Stack**: Vanilla HTML/CSS/JS, GitHub Pages (legacy build from `main`), no build step
- **Single self-contained page**: `index.html` holds all CSS (one `<style>`) and all JS (two inline
  `<script>`s at the end of `<body>`: the page script, then the Ask-about-me chat). The only remote
  assets are Google Fonts (Archivo, Martian Mono). The page also fetches `activity.json` (same origin).

## Commit rules (from Aravind, 2026-11-26)

- Commit as `axon011`. **Never add a `Co-Authored-By: Claude` (or any Anthropic) trailer** and never
  author commits as Claude. Only his name may appear as contributor or maintainer, in this repo and in
  every axon011 project repo. History was rewritten on 2026-11-26 to enforce this.
- Preview first, push only when Aravind says "push". The site deploys on push.

---

## File Structure

```
axon011.github.io/
├── index.html                      # THE site: markup + CSS + JS
├── activity.json                   # last commit + latest CI result per featured repo (read by the page)
├── .github/workflows/activity.yml  # daily job that rewrites activity.json (commits as axon011)
├── Aravind_Pradeep_AI_Engineer.pdf # résumé PDF (side column, phone bar, contact)
├── 404.html                        # custom not-found page; still on the OLD tokens (Sora + Inter)
├── og.png                          # 1200x630 share image (rendered artwork, see TODO)
├── favicon.svg / favicon.ico / apple-touch-icon.png
├── CNAME, robots.txt, sitemap.xml
├── reports/                        # historical audits of older versions; not a live TODO list
└── CLAUDE.md
```

---

## Design (2026-11-26 redesign: "Datasheet", split layout)

Chosen by Aravind over several previews (layouts A/B/C, looks Now/Datasheet/Phosphor/Heatmap), then
reworked after a recruiter-lens review and a phone pass. Preview history:
https://claude.ai/artifact/AEbRGzqVYjSpFFb3iZ2gvd (version 9 = what was ported).

- **Look**: an engineering component datasheet. Archivo for text, with names and project titles at
  `font-variation-settings:"wdth" 125` and weight 800; Martian Mono for numbers, labels and terminals.
  Pale green-grey paper `#eceee7`, ink `#111311`, one signal orange `#c2410c` (dark: `#101210` / `#ff7a3d`).
  Hairline rules, a 2px ink rule under section heads. No glass, gradients, glow or aurora.
- **Theme**: `html.light` / `html.dark`, set before paint by the boot script in `<head>` (localStorage
  key `theme`, else the OS). Tokens live on `:root` and `html.dark`. The toggle is `#theme` beside the name.
- **Layout**: a sticky identity column (`header.side.hero#top`) beside a scrolling main column. On phones
  (<960px) the column stacks on top, its section nav is hidden, the four buttons become a 2x2 grid, and a
  slim fixed bar (`#mbar`: name + Résumé + Email) slides in once the side buttons scroll away.
- **Recruiter rules** (from the recruiter-lens review): role, degree, location, availability and the four
  buttons (Résumé, GitHub, LinkedIn, Email) must be visible in the first screen at 1440x900, 1024x768 and on
  a phone. Plain words at rest ("Selected projects", "See the project", "47 / 50 test questions"), jargon
  (hit@5, test counts, trade-offs, limits) one click deeper. At rest each item shows a title and one number.
- **No em dashes** in visible copy. Copy goes through unslop. No fabricated numbers: every figure traces to a
  repo file, the paper or the résumé.

## Page map

| Part | id / class | Notes |
|---|---|---|
| Identity column | `header.side.hero#top` | name, "AI Engineer · M.Sc. Artificial Intelligence · Cottbus, Germany", availability, buttons, headline, career rail (Now / 2024-26 / 2026), focus line, section nav |
| Results strip | `.glance` | 47 / 50 (RAG eval, committed run), $0.00005 (one recorded gateway call), est. 48% (paper). The wind-farm planner was a CASE STUDY: never feature it (strip, explorer, featured cards); it lives in Other work labelled "case study" |
| Projects | `section.block#projects` | 3 featured `article.card.case` (RAG Evaluation System, LLM Gateway, Deutsch-Tutor), then 8 `article.card.row-card` under "Other work" |
| Try the results | `section.explore#explore` (NOT `.block`) | two tabs: RAG test set (50 cells from `eval/results/run_2026-05-01.json`, filters Missed / No citation / Slowest 10) and Fusion trade-off (Full model / Balanced / Power-save on an accuracy vs FLOPs chart with DSD Table II baselines). Data inline (`RQ`, `FU`) |
| Live demo | `section.live#live` (NOT `.block`) | replays recorded gateway calls (`CALLS`: gpt-oss-20b and gpt-oss-120b, recorded 2026-11-26) with a model picker; autoplays once in view, Replay button. Gemini was not recorded (empty key in the gateway `.env`) |
| Paper | `section.block#publications` | Fusion, 3 stats, "How it works" fold, arXiv / code / talk links |
| Skills | `section.block#skills` | five plain rows (AI & agents, Retrieval & data, ML & evaluation, Backend & web, Ops & cloud); every tool also appears on a project card or in Experience |
| Experience | `section.block#experience` | three jobs, first open; bullets verbatim from the résumé |
| Education | `section.block#education` | two degrees + languages |
| Contact | `section.block#contact` | email headline + Copy, links |

**Featured project anatomy** (`article.card.case`): head = kicker, activity line (`.act[data-repo]`, filled
from `activity.json`, shown only when CI passes), title link (`.card-link`), pitch, big number (`.big.metric`),
`.exp-btn` "See the project". Body (`.more.case-body`) = tabs: Overview (Problem, How it works pipeline
`.flow`, Evidence facts with source file, Built with chips), Example (RAG only: real dense / BM25 / fused
top-5 for question 16), Run it (`.term`, types captured test output, data inline as `TERMS`), Trade-offs,
Where it breaks. All numbers were captured 2026-11-26 from fresh clones (gateway 21 tests, rag-eval 29,
tutor 137 in 17 files; recorded call 111+130 tokens, $0.0000473, first token 3,133 ms).

**Motion** (count-up on headline numbers, hover shading on projects, a reading-progress line under the current nav link; all respect `prefers-reduced-motion`, which shows end states): pipeline stages light up as they
scroll through the view (`html.js .flow .st.lit`), the fused list fills in, terminals type once on screen,
the live call replays at its recorded timing.

---

## Ask about me (chat) - keep in sync

The chat script (`/* ================= Ask about me` ...) was carried over unchanged from the old site,
except "106 tests" → "107 tests". It depends on this page:

- **Project cards** are found as `#projects article.card` and matched by `.card-link` text, which must equal
  the names in `BOT_PID`. It reads `.pitch`, `.metric`, the first non-first-person `.more p`, `.card-foot .chip`,
  and opens a card by clicking its `.exp-btn`. Keep those class names on every project.
- **Sections**: `SECS` keys must be `section.block` ids (`projects`, `publications`, `skills`, `experience`,
  `education`, `contact`); the identity column is `.hero` (= `top`). Do not give other elements `.block`.
- **Answers are copy from the page.** If you edit availability, experience bullets, education, languages, the
  paper or contact copy, update the matching `BOT_INTENTS` answer and `BOT_LINES`. Re-check routing with
  `AskBot.engine.ask(q)` over every intent's `ex` (baseline 318/335, the misses are the old known ones).
- Its CSS was extracted into the `/* ===== Ask about me window ===== */` block; it uses alias tokens
  (`--surface-solid`, `--accent-ink`, `--line` ...) defined on `:root`.
- Open question (2026-11-26): the chat and the old Gateway copy say the live tutor routes calls through the
  gateway. The tutor-side client is not in the public german-tutor repo; Aravind has not confirmed it.

## activity.json

`{"generated": ISO, "repos": [{"repo", "last_commit", "ci"}]}` for 8 repos. The workflow runs daily at 04:20
UTC (and on demand), uses `gh api` with the default token, and commits only when the file changes. The page
shows a line only for `ci == "success"`; the tutor has no CI, so it shows none.

---

## GitHub Username

`axon011` appears in `index.html` (JSON-LD `sameAs`, OG image URL, buttons, project links, contact, footer),
in `activity.json` and in the workflow. A rename needs a find-and-replace across those three files.

## Companion Repo: axon011 (Profile README)

`C:\Users\Aravind\Desktop\workspace\GIT\axon011-profile\` (repo `axon011/axon011`). Its weekly
`refresh-readme.yml` commits as axon011 since 2026-11-26.

## Phone baseline

`html` has `-webkit-tap-highlight-color:transparent`, `text-size-adjust:100%`, `overflow-x:clip`; controls have
`touch-action:manipulation`; on `pointer:coarse` every button and link row is at least 44px tall. Two
`theme-color` metas (light `#eceee7`, dark `#101210`) follow the OS and the toggle rewrites both. Deliberately
NOT added: `interactive-widget=resizes-content` (it would defeat the chat window's `visualViewport` fit).

## Known issues / TODO

- [ ] `404.html` still uses the old Sora/Inter tokens; restyle it in Datasheet.
- [ ] `og.png` shows the old design; re-render it in Datasheet (regenerate from an HTML recipe, do not edit the PNG).
- [ ] The `<title>` and OG titles still use an em dash ("Aravind Pradeep — AI Engineer").
- [ ] Removed in the redesign (in git history if wanted back): cycling hero deck, skill map + toolkit, section
      map, scroll transitions, aurora, FUSION token animation, per-project pipeline diagrams (`.dgw`),
      `content-visibility` tiers.
- [ ] Consider a short "lab notes" section (the guide's writing signal); the RAG eval finding (retrieval-only
      hit@5 = 1.00 because `corpus.md` repeats each question as a heading) is drafted but not approved for publishing.
