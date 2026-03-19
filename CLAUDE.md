# CLAUDE.md - axon011.github.io

## Project Overview

- **Project**: Personal portfolio / landing page for GitHub Pages
- **URL**: https://aravindpradee.me (custom domain) / https://axon011.github.io
- **Owner**: Aravind Pradeep (Junior AI Engineer)
- **Stack**: Vanilla HTML/CSS/JS, Tailwind CSS (CDN), GitHub Pages
- **No build step** - static files served directly

---

## File Structure

```
axon011.github.io/
├── index.html              # Main landing page (single page app)
├── css/
│   └── style.css           # All custom styles, CSS variables for theming
├── js/
│   └── script.js           # All interactivity, GitHub API, animations
├── AI Product Engineer.pdf # Resume PDF (linked from hero download button)
├── CNAME                   # Custom domain config (aravindpradee.me)
├── robots.txt              # Crawl rules
├── sitemap.xml             # Sitemap for SEO
├── .claude/
│   └── skills/
│       └── frontend-engineer/
│           └── SKILL.md    # Frontend engineer skill for Claude Code
├── README.md               # Repo README
└── CLAUDE.md               # This file
```

---

## Key Design Decisions

- **Single HTML file** - no framework, no build tools, no dependencies beyond Tailwind CDN
- **Two fonts**: Inter (body) + JetBrains Mono (code snippets)
- **CSS variables** for theming - light/dark mode via `[data-theme="dark"]`
- **GitHub API** called client-side to fetch repos (no token needed for public data)
- **Formspree** for contact form (form ID: `xgonengv`)
- **Pill-shaped buttons** with gradient primary, glassmorphic secondary
- **Skill levels** use Expert/Advanced/Intermediate badges (not percentage bars)
- **No cursor glow** - normal browser cursor for accessibility
- **No interactive terminal** - replaced with clean About Me section for recruiter readability

---

## Interactive Elements

| Feature | Location | How it works |
|---------|----------|-------------|
| Typing effect | Hero tagline | Cycles through 5 phrases with type/delete animation |
| Neural net particles | Canvas background | Particles react to mouse, connect with lines when close |
| Skill level badges | `#skills` section | Expert/Advanced/Intermediate pill badges |
| GitHub repos | `#projects` section | Top 6 non-fork repos loaded dynamically via API |
| Language filter pills | `#projects` section | Filter project cards by programming language |
| Contribution graph | `#github-stats` | Image from ghchart.rshah.org, theme-aware colors |
| Scroll progress | Top bar | Width tracks scroll position |
| Active nav | Navbar links | Highlights current section via IntersectionObserver |
| Scroll animations | All sections | Fade-in-up on scroll via `.scroll-target` + IntersectionObserver |
| Dark/light toggle | Navbar | Persisted in localStorage |
| Mobile menu | Hamburger button | Toggles hidden class |
| Back to top | Fixed bottom-right | Shows after 400px scroll |
| Contact form | `#contact` section | Posts to Formspree, shows success/error status |
| Resume download | Hero CTAs | Direct PDF download with `download` attribute |

---

## Section Map

| Section ID | Description |
|-----------|-------------|
| `#hero` | Full-screen intro with typing effect, CTAs (View Projects, Get in Touch, Resume, GitHub), social links |
| `#about` | Clean About Me with professional summary + 4 highlight cards (M.Sc., 1+ years, GenAI, Full-Stack) |
| `#experience` | Timeline with two positions (Perinet GmbH, Cognizant) |
| `#projects` | Dynamic GitHub repo cards with language filter pills (fetched via API) |
| `#skills` | Two skill cards with level badges + two tag cloud cards (Frameworks, Cloud/DevOps) |
| `#github-stats` | Contribution graph + "View on GitHub" link |
| `#education` | Timeline with two entries (M.Sc., B.Sc.) |
| `#languages` | 3 language cards with level badges (English, German, Malayalam) |
| `#contact` | Contact info + Formspree form |

---

## GitHub Username

The GitHub username `axon011` is used in multiple places:
- `script.js` line 2: `const GITHUB_USERNAME = 'axon011'`
- `index.html`: GitHub links, contribution graph URL
- Contribution graph: `ghchart.rshah.org/{color}/axon011`

If username changes, update all files.

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

## Known Issues (2026-03-19)

- [ ] Projects section may not load if GitHub API rate limit is hit (unauthenticated: 60 req/hr)
- [ ] Contribution graph depends on third-party service (ghchart.rshah.org) — may occasionally fail
- [ ] Mouse pointer may not show on some browsers if old cached CSS with `cursor: none` is served — hard refresh (Ctrl+Shift+R) fixes this

---

## TODO

- [ ] Add favicon
- [ ] Add Open Graph image for social sharing previews
- [ ] Consider adding a blog section
