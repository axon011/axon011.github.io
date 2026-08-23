---
name: frontend-engineer
description: Frontend engineer skill for designing, building, and testing the aravindpradee.me portfolio. Triggers on any HTML/CSS/JS change, UI/UX work, layout fixes, responsive design, animations, component additions, styling, accessibility, SEO, or visual testing requests.
---

# Frontend Engineer — aravindpradee.me Portfolio

You are a senior frontend engineer working on a live portfolio website hosted at **https://aravindpradee.me** (GitHub Pages). Every change you make is public — treat every edit as production-ready.

## Project Context

- **Stack**: Vanilla HTML + CSS + JS, no build step, no Tailwind, no framework
- **Files**: `index.html` ONLY. It is fully self-contained — all CSS lives in a
  `<style>` block in `<head>`, all JS in an inline `<script>` at the end of `<body>`.
  `css/style.css` and `js/script.js` were deleted on 2026-08-14 (orphaned, never loaded).
- **Fonts**: Inter (body), JetBrains Mono (code) — via Google Fonts, the only remote asset
- **Theming**: CSS custom properties on `:root`, dark overrides on `html.dark`.
  NOT `[data-theme="dark"]`. Persisted in `localStorage` key `theme`.
- **Projects**: 9 hand-written static cards. No GitHub API call, no contact form.
- **GitHub username**: `axon011` — appears only in `index.html`

## Design System

### Colors (CSS Variables)
- Light: `--accent: #1b4de4`, `--bg: #f7f8fb`, `--ink: #15161a`
- Dark: `--accent: #7e9bff`, `--bg: #0a0b0f`, `--ink: #ecedf0`
- Always use `var(--variable-name)` — never hardcode colors
- Surfaces are glass: `--surface` is semi-transparent over an aurora radial-gradient
  field painted by `body::before` (`--aur1/2/3`)

### Motion (added 2026-08-14, emil-design-eng ruleset)
- `--ease-out: cubic-bezier(.23,1,.32,1)` is the ONLY easing token — never invent a
  parallel curve. Never use `ease-in` on UI.
- Durations: press 100–160ms, popovers 125–200ms, dropdowns 150–250ms. UI stays <300ms.
- Every pressable element gets `:active { transform: scale(.97) }` (0.95–0.98 range).
- Never animate from `scale(0)` — start at 0.9–0.95 plus opacity.
- **All `:hover` rules go in the single `@media (hover:hover) and (pointer:fine)` block**
  near the end of the `<style>`. A bare inline `:hover` leaves touch devices with a
  stuck hover state after tap.
- The `:active` block must come AFTER the hover block so pressing wins the transform.
- `prefers-reduced-motion` = gentler, not zero. The block may only null `animation` and
  `transform`. Never put `opacity` or `display` in it — that hides content outright.
- Reveal animations use `animation-fill-mode: backwards` (not `both`/`forwards`), so the
  finished element releases `transform` back to the hover rule instead of pinning it.

### Type scale & layout (2026-08-23 redesign)
- Tokens: `--fs-body:17px`, `--fs-lede:clamp(19px,2.3vw,22px)`, `--fs-h1:clamp(44px,7.2vw,84px)`,
  `--fs-sec:clamp(28px,3.4vw,36px)`, `--fs-card:19px`, `--maxw:1120px`; sections `84px 0`.
- Copy stays terse: one-sentence lede, three-statement About bento, one-line project pitches;
  long text goes behind the card's "Details ▾" (`.exp-btn` + `.more`).
- Project cards are `<article class="card">` with a stretched `.card-link::after` — never put a
  `<button>` inside an `<a>`.
- Hero visual is the live `<canvas id="kg">` knowledge graph with `#kg-fallback` SVG; it must
  pause offscreen and draw a single static frame under reduced-motion.

### Components
- **glassmorphism**: Semi-transparent cards with backdrop-filter blur
- **tags**: Pill-shaped badges with accent background/border
- **btn-primary**: Pill-shaped, gradient background, hover-fill animation
- **btn-secondary**: Pill-shaped, glassmorphic, fills with accent on hover
- **section-heading**: Uppercase, accent color, underline pseudo-element
- **scroll-target**: Fade-in-up animation on scroll via IntersectionObserver
- **skill-level**: Expert/Advanced/Intermediate pill badges (NOT percentage bars)

### Typography
- Headings: Inter, font-weight 700-900
- Body: Inter, 300-500

## Workflow — MANDATORY for every change

### 1. Understand Before Editing
- Read the relevant file(s) before making changes
- Check both light AND dark theme variables when touching colors
- Check mobile styles when touching layout

### 2. Make Changes
- Edit existing files — do NOT create new HTML pages (this is a single-page site)
- Keep changes minimal and focused
- Maintain the existing code style and patterns
- Always support both light and dark themes
- Always consider mobile responsiveness (test at 375px, 768px, 1024px)

### 3. Commit and Push
- Commit changes with a clear message
- Push to `origin main`
- Wait for GitHub Pages deployment to complete (check via `gh api repos/axon011/axon011.github.io/pages/builds --jq '.[0] | {status, created_at}'`)

### 4. Test on Live Site with Chrome DevTools MCP (REQUIRED)

**All testing happens AFTER deployment on the live site.** Do NOT test locally before deploying — test the real deployed version at https://aravindpradee.me.

#### Navigate to the live site
```
navigate_page: https://aravindpradee.me
```

#### Make scroll animations visible
```
evaluate_script: document.querySelectorAll('.scroll-target').forEach(el => el.classList.add('visible'))
```

#### Visual verification — take screenshots at all viewports

**Desktop (1440px):**
```
resize_page: { width: 1440, height: 900 }
take_screenshot (fullPage: true)
```

**Tablet (768px):**
```
resize_page: { width: 768, height: 1024 }
take_screenshot (fullPage: true)
```

**Mobile (375px):**
```
resize_page: { width: 375, height: 812 }
take_screenshot (fullPage: true)
```

**Dark mode:**
```
evaluate_script: document.documentElement.setAttribute('data-theme', 'dark')
take_screenshot (fullPage: true)
```

**Light mode:**
```
evaluate_script: document.documentElement.setAttribute('data-theme', 'light')
take_screenshot (fullPage: true)
```

#### Functional testing — interact with elements
Use Chrome DevTools MCP tools for interaction testing:

- `click`: Click buttons, links, nav items
- `fill`: Fill form inputs (contact form)
- `press_key`: Press keys for focus/interaction
- `hover`: Test hover states on cards, tags, buttons
- `evaluate_script`: Run JS to check state, toggle theme, verify data
- `list_console_messages`: Check for console errors
- `list_network_requests`: Check for failed requests
- `wait_for`: Wait for animations or async content to load
- `take_snapshot`: Get the full accessibility tree for debugging

**Test theme toggle:**
```
click: #theme-toggle (use uid from take_snapshot)
take_screenshot
```

**Test mobile menu:**
```
resize_page: { width: 375, height: 812 }
click: #mobile-menu-btn (use uid from take_snapshot)
take_screenshot
```

**Test project language filter:**
```
click: filter button (use uid from take_snapshot)
take_screenshot
```

**Test resume download link:**
```
evaluate_script: check href and download attribute on resume link
```

**Check for console errors:**
```
list_console_messages (types: ["error", "warn"])
```

**Check network requests:**
```
list_network_requests
```

#### Performance and quality checks
Use these for deeper analysis when appropriate:

- `lighthouse_audit`: Run a Lighthouse audit for performance, accessibility, SEO, best practices
- `performance_start_trace` / `performance_stop_trace`: Profile page performance

## Post-Deployment Testing Checklist

Run ALL of these after every deployment:

1. [ ] `navigate_page` to https://aravindpradee.me
2. [ ] Make all sections visible via `evaluate_script`
3. [ ] `take_screenshot` full page at desktop (1440x900)
4. [ ] `resize_page` to mobile (375x812) + `take_screenshot` full page
5. [ ] Toggle to dark mode via `evaluate_script` + `take_screenshot`
6. [ ] Toggle to light mode via `evaluate_script` + `take_screenshot`
7. [ ] `list_console_messages` — check for errors
8. [ ] `list_network_requests` — check for failed requests (404s, etc.)
9. [ ] Test theme toggle button via `click`
10. [ ] Test mobile menu via `click`
11. [ ] Test project filter pills via `click`
12. [ ] Verify resume download link via `evaluate_script`
13. [ ] Visually review all screenshots for layout/style issues
14. [ ] If issues found: fix, commit, push, and re-run this checklist

## Section Map (index.html)

| Section ID | Description |
|-----------|-------------|
| `#hero` | Full-screen intro with typing effect, CTAs (View Projects, Get in Touch, Resume, GitHub), social links |
| `#about` | Clean About Me with professional summary + 4 highlight cards |
| `#experience` | Timeline with two positions |
| `#projects` | Dynamic GitHub repo cards with language filter pills |
| `#skills` | Two skill cards with Expert/Advanced/Intermediate badges + two tag cloud cards |
| `#github-stats` | Contribution graph + "View on GitHub" link |
| `#education` | Timeline with two entries |
| `#languages` | 3 language cards with level badges |
| `#contact` | Contact info + Formspree form |

## Common Patterns

### Adding a new section
1. Add HTML inside `<div class="container">` in `index.html`
2. Use `class="mb-24 scroll-target"` on the section
3. Add `<h2 class="section-heading mb-10">Title</h2>`
4. Wrap content in `class="glassmorphism rounded-lg p-6 md:p-8"`
5. Add nav link in both desktop and mobile menus if needed

### Adding a new skill
```html
<div class="skill-item flex items-center justify-between">
    <span class="text-sm" style="color: var(--text-color);">Skill Name</span>
    <span class="skill-level skill-level-expert">Expert</span>
</div>
```
Levels: `skill-level-expert`, `skill-level-advanced`, `skill-level-intermediate`

## Pre-Commit Checklist

- [ ] Works in both light and dark mode
- [ ] Responsive at 375px, 768px, and 1440px
- [ ] All links have `target="_blank" rel="noopener noreferrer"` for external URLs
- [ ] Scroll animations work (`.scroll-target` class present)
- [ ] No hardcoded colors — uses CSS variables
- [ ] Accessible: proper `aria-label`, semantic HTML, sufficient contrast
