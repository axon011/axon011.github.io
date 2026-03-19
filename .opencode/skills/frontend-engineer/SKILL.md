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

### 3. Commit and Push
- Commit changes with a clear message
- Push to `origin main`
- Wait for GitHub Pages deployment to complete

### 4. Test on Live Site with Chrome DevTools MCP (REQUIRED)

**All testing happens AFTER deployment on the live site.** Do NOT test locally before deploying — test the real deployed version at https://aravindpradee.me.

Use these Chrome DevTools MCP tools:

| Tool | Purpose |
|------|---------|
| `chrome-devtools_navigate_page` | Open the live site |
| `chrome-devtools_evaluate_script` | Enable scroll animations, toggle themes |
| `chrome-devtools_take_screenshot` | Capture screenshots (fullPage: true) |
| `chrome-devtools_resize_page` | Test responsive breakpoints |
| `chrome-devtools_click` | Test buttons, nav items |
| `chrome-devtools_list_console_messages` | Check for JS errors |
| `chrome-devtools_list_network_requests` | Check for failed requests |
| `chrome-devtools_take_snapshot` | Get accessibility tree |
| `chrome-devtools_lighthouse_audit` | Run performance/accessibility/SEO audits |

#### Testing Steps

1. **Navigate to site**
   - Use: `chrome-devtools_navigate_page` with URL `https://aravindpradee.me`

2. **Enable scroll animations**
   - Use: `chrome-devtools_evaluate_script`
   - Script: `document.querySelectorAll('.scroll-target').forEach(el => el.classList.add('visible'))`

3. **Take screenshots at all viewports**
   - Desktop: `chrome-devtools_resize_page` (1440, 900) → `chrome-devtools_take_screenshot` (fullPage: true)
   - Tablet: `chrome-devtools_resize_page` (768, 1024) → screenshot
   - Mobile: `chrome-devtools_resize_page` (375, 812) → screenshot

4. **Test themes**
   - Dark: `chrome-devtools_evaluate_script` with `document.documentElement.setAttribute('data-theme', 'dark')` → screenshot
   - Light: `chrome-devtools_evaluate_script` with `document.documentElement.setAttribute('data-theme', 'light')` → screenshot

5. **Check for errors**
   - `chrome-devtools_list_console_messages` (types: ["error", "warn"])
   - `chrome-devtools_list_network_requests` (check for 404s)

## Post-Deployment Testing Checklist

Run ALL of these after every deployment:

1. [ ] Navigate to https://aravindpradee.me
2. [ ] Enable scroll animations
3. [ ] Screenshot desktop (1440x900)
4. [ ] Screenshot tablet (768x1024)
5. [ ] Screenshot mobile (375x812)
6. [ ] Screenshot dark mode
7. [ ] Screenshot light mode
8. [ ] Check console for errors
9. [ ] Check network for failed requests
10. [ ] Test theme toggle
11. [ ] Test mobile menu
12. [ ] Test project filter pills
13. [ ] Review screenshots for issues
14. [ ] If issues found: fix, commit, push, repeat

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
| `#contact` | Contact info + Formspree form |

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

- [ ] Works in both light and dark mode
- [ ] Responsive at 375px, 768px, and 1440px
- [ ] All links have `target="_blank" rel="noopener noreferrer"` for external URLs
- [ ] Scroll animations work (`.scroll-target` class present)
- [ ] No hardcoded colors — uses CSS variables
- [ ] Accessible: proper `aria-label`, semantic HTML, sufficient contrast
