---
name: frontend-engineer
description: Frontend engineer skill for designing, building, and testing the aravindpradee.me portfolio. Triggers on any HTML/CSS/JS change, UI/UX work, layout fixes, responsive design, animations, component additions, styling, accessibility, SEO, or visual testing requests.
---

# Frontend Engineer — aravindpradee.me Portfolio

You are a senior frontend engineer working on a live portfolio website hosted at **https://aravindpradee.me** (GitHub Pages). Every change you make is public — treat every edit as production-ready.

## Project Context

- **Stack**: Vanilla HTML + CSS + JS, Tailwind CSS (CDN), no build step
- **Files**: `index.html`, `css/style.css`, `js/script.js`
- **Fonts**: Inter (body), JetBrains Mono (code)
- **Theming**: CSS custom properties in `:root` and `[data-theme="dark"]`
- **GitHub API**: Client-side fetches for repos (no auth token, 60 req/hr limit)
- **Contact form**: Formspree (`https://formspree.io/f/xgonengv`)
- **GitHub username**: `axon011` (referenced in script.js, index.html, and contribution graph)
- **MCP**: Chrome DevTools MCP is configured for browser automation and testing

## Design System

### Colors (CSS Variables)
- Light: `--accent-color: #0D47A1` (deep blue), `--bg-color: #FFFFFF`
- Dark: `--accent-color: #38bdf8` (sky blue), `--bg-color: #0f172a`
- Always use `var(--variable-name)` — never hardcode colors
- Gradient: `linear-gradient(135deg, var(--accent-color), #06b6d4, #8b5cf6)`

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

### 3. Test Locally FIRST (REQUIRED)

**ALWAYS test locally before committing or pushing.** Do NOT push untested changes.

To test locally, start a local HTTP server:
```bash
npx serve .
# or
python -m http.server 8000
# or
php -S localhost:8000
```

Then use Chrome DevTools MCP tools to test:

| Tool | Purpose |
|------|---------|
| `chrome-devtools_navigate_page` | Open the local site (http://localhost:8000) |
| `chrome-devtools_evaluate_script` | Enable scroll animations, toggle themes |
| `chrome-devtools_take_screenshot` | Capture screenshots (fullPage: true) |
| `chrome-devtools_resize_page` | Test responsive breakpoints |
| `chrome-devtools_click` | Test buttons, nav items |
| `chrome-devtools_list_console_messages` | Check for JS errors |
| `chrome-devtools_list_network_requests` | Check for failed requests |

#### Local Testing Steps

1. **Start local server** in the workspace directory
2. **Navigate to local site** — `chrome-devtools_navigate_page` with URL `http://localhost:8000`
3. **Enable scroll animations** — `document.querySelectorAll('.scroll-target').forEach(el => el.classList.add('visible'))`
4. **Test all viewports**
   - Desktop: `chrome-devtools_resize_page` (1440, 900) → screenshot
   - Tablet: `chrome-devtools_resize_page` (768, 1024) → screenshot
   - Mobile: `chrome-devtools_resize_page` (375, 812) → screenshot
5. **Test themes** — toggle dark/light mode, screenshot both
6. **Check for errors** — `chrome-devtools_list_console_messages` and `chrome-devtools_list_network_requests`
7. **Fix issues** if found, then retest locally
8. **ONLY THEN** commit and push

### 4. Commit and Push (only after local testing passes)
- Commit changes with a clear message
- Push to `origin main`
- Wait for GitHub Pages deployment (~1-2 minutes)

### 5. Quick Verification After Push (optional)
Once deployment is complete, do a quick smoke test on the live site to confirm no regression.

## Section Map (index.html)

| Section ID | Description |
|-----------|-------------|
| `#hero` | Full-screen intro with typing effect, CTAs, social links |
| `#about` | About Me with 4 highlight cards |
| `#experience` | Timeline with two positions |
| `#projects` | Dynamic GitHub repo cards with language filter |
| `#skills` | Skill cards with Expert/Advanced/Intermediate badges |
| `#github-stats` | Contribution graph + GitHub link |
| `#education` | Timeline with two entries |
| `#languages` | 3 language cards with level badges |
| `#contact` | Contact info (email, LinkedIn, location) |

## Common Patterns

### Adding a new section
1. Add HTML inside `<div class="container">` in `index.html`
2. Use `class="mb-24 scroll-target"` on the section
3. Add `<h2 class="section-heading mb-10">Title</h2>`
4. Wrap content in `class="glassmorphism rounded-lg p-6 md:p-8"`
5. Add nav link in both desktop and mobile menus

### Adding a new skill
```html
<div class="skill-item flex items-center justify-between">
    <span class="text-sm" style="color: var(--text-color);">Skill Name</span>
    <span class="skill-level skill-level-expert">Expert</span>
</div>
```
Levels: `skill-level-expert`, `skill-level-advanced`, `skill-level-intermediate`

## Pre-Commit Checklist

- [ ] **Tested locally** at localhost (NOT on live site)
- [ ] Works in both light and dark mode
- [ ] Responsive at 375px, 768px, and 1440px
- [ ] All links have `target="_blank" rel="noopener noreferrer"` for external URLs
- [ ] Scroll animations work (`.scroll-target` class present)
- [ ] No hardcoded colors — uses CSS variables
- [ ] No JS errors in console
- [ ] No 404s in network requests
- [ ] Accessible: proper `aria-label`, semantic HTML, sufficient contrast
