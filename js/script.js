document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_USERNAME = 'axon011';

    // ==========================================
    // Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlEl = document.documentElement;

    function setThemeIcons() {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        sunIcon.classList.toggle('hidden', isDark);
        moonIcon.classList.toggle('hidden', !isDark);
    }

    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.setAttribute('data-theme', 'dark');
    }
    setThemeIcons();

    themeToggleBtn.addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        setThemeIcons();
    });

    // ==========================================
    // Mobile Menu
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // ==========================================
    // Scroll Progress Bar
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
        scrollProgress.style.width = pct + '%';

        navbar.classList.toggle('scrolled', scrolled > 50);
        backToTop.classList.toggle('hidden', scrolled < 400);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // Typing Effect (multiple phrases)
    // ==========================================
    const taglineEl = document.getElementById('tagline');
    const phrases = [
        'Agentic Systems & Production RAG',
        'Multi-Agent Pipelines',
        'Full-Stack GenAI Apps',
        'LLMOps & Observability',
        'Python, LangChain, FastAPI'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
        const current = phrases[phraseIdx];
        if (!isDeleting) {
            taglineEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(typeLoop, 2000);
                return;
            }
            setTimeout(typeLoop, 80);
        } else {
            taglineEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(typeLoop, 400);
                return;
            }
            setTimeout(typeLoop, 40);
        }
    }
    typeLoop();

    // ==========================================
    // Scroll Animations & Skill Bars
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-target').forEach(t => observer.observe(t));

    // ==========================================
    // Active Nav Highlighting (top nav + sidebar rail)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-top');
    const railLinks = document.querySelectorAll('.rail-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === '#' + id);
                });
                railLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => navObserver.observe(s));

    // ==========================================
    // Neural Net Background
    // ==========================================
    const canvas = document.getElementById('neural-net-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function getThemeColors() {
        const style = getComputedStyle(document.body);
        return {
            particle: style.getPropertyValue('--text-muted').trim() || '#555',
            line: style.getPropertyValue('--accent-color').trim() || '#0D47A1'
        };
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x; this.y = y;
            this.dx = dx; this.dy = dy;
            this.size = size;
            this.baseX = x; this.baseY = y;
            this.density = (Math.random() * 30) + 1;
        }
        draw() {
            const colors = getThemeColors();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = colors.particle;
            ctx.globalAlpha = 0.25;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
        update() {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) this.dx = -this.dx;
            if (this.y + this.size > canvas.height || this.y - this.size < 0) this.dy = -this.dy;

            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * this.density * 0.4;
                    this.y -= (dy / dist) * force * this.density * 0.4;
                } else {
                    this.x -= (this.x - this.baseX) / 20;
                    this.y -= (this.y - this.baseY) / 20;
                    this.x += this.dx;
                    this.y += this.dy;
                }
            } else {
                this.x += this.dx;
                this.y += this.dy;
            }
            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min((canvas.width * canvas.height) / 15000, 80);
        for (let i = 0; i < count; i++) {
            let size = Math.random() * 2 + 0.5;
            let x = Math.random() * (canvas.width - size * 4) + size * 2;
            let y = Math.random() * (canvas.height - size * 4) + size * 2;
            let dx = (Math.random() - 0.5) * 0.4;
            let dy = (Math.random() - 0.5) * 0.4;
            particles.push(new Particle(x, y, dx, dy, size));
        }
    }

    function connectParticles() {
        const colors = getThemeColors();
        const maxDist = 18000;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distSq = dx * dx + dy * dy;
                if (distSq < maxDist) {
                    ctx.strokeStyle = colors.line;
                    ctx.globalAlpha = Math.max(0, 1 - distSq / maxDist);
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        connectParticles();
    }

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    // ==========================================
    // GitHub API Integration
    // ==========================================

    // GitHub language color map
    const LANG_COLORS = {
        Python: '#3572A5',
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Go: '#00ADD8',
        Rust: '#dea584',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Shell: '#89e051',
        'Jupyter Notebook': '#DA5B0B',
        C: '#555555',
        'C++': '#f34b7d',
        Java: '#b07219',
    };

    // AI/ML tech term highlighting
    const AI_TERMS = [
        'Agentic AI', 'Multi-Agent', 'LangGraph', 'LangChain', 'CrewAI',
        'Hugging Face', 'OpenAI', 'Anthropic', 'LLMOps', 'Fine-tuning',
        'Quantization', 'Pruning', 'Computer Vision', 'Edge AI', 'Diffusion',
        'Retrieval', 'Augmented', 'Generation', 'Transformer', 'Embeddings',
        'FastAPI', 'MLflow', 'Langfuse', 'PyTorch', 'Vector', 'Pipeline',
        'Docker', 'Agent', 'ONNX', 'LLM', 'RAG', 'GPT', 'ViT', 'NLP'
    ];
    // Sort longest first so "Hugging Face" matches before "Face", etc.
    const SORTED_TERMS = [...AI_TERMS].sort((a, b) => b.length - a.length);
    const TECH_TERM_REGEX = new RegExp(
        '(' + SORTED_TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')',
        'gi'
    );
    function highlightTechTerms(text) {
        return text.replace(TECH_TERM_REGEX, '<span class="tech-highlight">$1</span>');
    }

    // Fetch README from raw.githubusercontent.com (CDN, not API rate-limited)
    async function fetchReadme(repoName) {
        const base = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}`;
        try {
            let res = await fetch(`${base}/main/README.md`);
            if (!res.ok) res = await fetch(`${base}/master/README.md`);
            if (!res.ok) return null;
            return await res.text();
        } catch { return null; }
    }

    // Strip markdown and extract plain text description (~200 chars)
    function extractReadmeDescription(rawMarkdown) {
        if (!rawMarkdown) return null;
        const lines = rawMarkdown.split('\n');
        const descLines = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('#')) continue;
            if (trimmed.startsWith('```')) continue;
            if (trimmed.startsWith('---') || trimmed.startsWith('===')) continue;
            if (trimmed.startsWith('<') && trimmed.endsWith('>')) continue;
            if (trimmed.startsWith('![') || trimmed.startsWith('[![')) continue;
            let clean = trimmed
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/\*(.+?)\*/g, '$1')
                .replace(/`(.+?)`/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
                .trim();
            if (clean.length > 20) descLines.push(clean);
            if (descLines.join(' ').length >= 200) break;
        }
        const joined = descLines.join(' ');
        if (!joined) return null;
        if (joined.length <= 200) return joined;
        const truncated = joined.substring(0, 200);
        const lastSpace = truncated.lastIndexOf(' ');
        return (lastSpace > 100 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }

    function renderSkeletons(container, count) {
        container.innerHTML = Array.from({ length: count }, () =>
            `<div class="project-card-skeleton"></div>`
        ).join('');
    }

    async function fetchGitHubData() {
        const projectsGrid = document.getElementById('projects-grid');
        const langFilters = document.getElementById('lang-filters');
        const noResults = document.getElementById('no-results');
        const TOP_N = 6;

        // Show shimmer skeletons immediately while fetching
        renderSkeletons(projectsGrid, TOP_N);

        try {
            const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);

            if (!reposRes.ok) {
                projectsGrid.innerHTML = '<p class="col-span-2 text-center" style="color: var(--text-muted);">Could not load projects.</p>';
                return;
            }

            const repos = await reposRes.json();

            // Select top repos by popularity
            const topRepos = repos
                .filter(r => !r.fork && r.name !== GITHUB_USERNAME + '.github.io' && r.name !== GITHUB_USERNAME)
                .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
                .slice(0, TOP_N);

            // Fetch all READMEs in parallel
            const readmes = await Promise.all(topRepos.map(r => fetchReadme(r.name)));

            // Build filter buttons from languages + top topics
            const langSet = new Set(topRepos.map(r => r.language).filter(Boolean));
            const topicCounts = {};
            topRepos.forEach(r => (r.topics || []).forEach(t => {
                topicCounts[t] = (topicCounts[t] || 0) + 1;
            }));
            const topTopics = Object.entries(topicCounts)
                .filter(([t]) => !langSet.has(t.toLowerCase()) && !['python', 'typescript'].includes(t))
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([t]) => t);
            const filterLabels = ['All', ...langSet, ...topTopics];
            langFilters.innerHTML = filterLabels.map(label => {
                const isLang = langSet.has(label);
                const dot = isLang
                    ? `<span class="lang-dot" style="background:${LANG_COLORS[label] || 'var(--accent-color)'}"></span>`
                    : '';
                return `<button class="filter-btn${label === 'All' ? ' active' : ''}" data-lang="${label}" data-type="${isLang ? 'lang' : 'topic'}">${dot}${label}</button>`;
            }).join('');

            // Render cards
            projectsGrid.innerHTML = topRepos.map((repo, i) => {
                const readmeDesc = extractReadmeDescription(readmes[i]);
                const rawDesc = readmeDesc || repo.description || 'No description available.';
                const escaped = rawDesc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const descHtml = highlightTechTerms(escaped);

                const starsHtml = repo.stargazers_count > 0
                    ? `<span class="flex items-center gap-1">
                           <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                           ${repo.stargazers_count}
                       </span>` : '';

                const forksHtml = repo.forks_count > 0
                    ? `<span class="flex items-center gap-1">
                           <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 3a3 3 0 013 3c0 1.31-.84 2.42-2 2.83V11c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V8.83c-1.16-.41-2-1.52-2-2.83a3 3 0 116 0c0 1.31-.84 2.42-2 2.83V11c0 1.65-1.35 3-3 3h-3v2.17c1.16.41 2 1.52 2 2.83a3 3 0 11-6 0c0-1.31.84-2.42 2-2.83V14H9c-1.65 0-3-1.35-3-3V8.83C4.84 8.42 4 7.31 4 6a3 3 0 012-2.83V3z"/></svg>
                           ${repo.forks_count}
                       </span>` : '';

                const langColor = LANG_COLORS[repo.language] || 'var(--accent-color)';
                const langHtml = repo.language
                    ? `<span class="flex items-center gap-1.5 text-xs px-2 py-1 rounded" style="background: var(--accent-bg); color: var(--accent-color);">
                           <span class="lang-dot" style="background:${langColor}"></span>${repo.language}
                       </span>` : '';

                const topicsHtml = repo.topics
                    ? repo.topics.slice(0, 3).map(t =>
                        `<span class="text-xs px-2 py-1 rounded" style="background: var(--accent-bg); color: var(--accent-color);">${t}</span>`
                      ).join('')
                    : '';

                return `
                    <div class="project-card-wrap" data-lang="${repo.language || ''}" data-topics="${(repo.topics || []).join(',')}" data-name="${repo.name.toLowerCase()}" data-desc="${rawDesc.toLowerCase()}">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
                           class="project-card card-interactive p-6 flex flex-col h-full">
                            <div class="flex items-start justify-between mb-3">
                                <svg class="w-7 h-7" style="color: var(--accent-color);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <div class="flex items-center gap-3 text-xs" style="color: var(--text-muted);">
                                    ${starsHtml}${forksHtml}
                                </div>
                            </div>
                            <h3 class="text-lg font-bold mb-2" style="color: var(--text-color);">${repo.name}</h3>
                            <p class="text-sm mb-4 flex-1" style="color: var(--text-muted);">${descHtml}</p>
                            <div class="flex flex-wrap gap-2">
                                ${langHtml}${topicsHtml}
                            </div>
                            <span class="card-action">
                                View on GitHub
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            </span>
                        </a>
                    </div>
                `;
            }).join('');

            // --- Filter logic ---
            let activeFilter = 'All';
            let activeType = 'all';

            function applyFilters() {
                let visible = 0;
                document.querySelectorAll('.project-card-wrap').forEach(wrap => {
                    let matches = false;
                    if (activeFilter === 'All') {
                        matches = true;
                    } else if (activeType === 'lang') {
                        matches = wrap.dataset.lang === activeFilter;
                    } else {
                        const topics = (wrap.dataset.topics || '').split(',');
                        matches = topics.includes(activeFilter);
                    }
                    if (matches) {
                        wrap.classList.remove('hidden-card');
                        visible++;
                    } else {
                        wrap.classList.add('hidden-card');
                    }
                });
                noResults.classList.toggle('hidden', visible > 0);
            }

            langFilters.addEventListener('click', e => {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;
                activeFilter = btn.dataset.lang;
                activeType = btn.dataset.type || 'all';
                langFilters.querySelectorAll('.filter-btn').forEach(b =>
                    b.classList.toggle('active', b === btn)
                );
                applyFilters();
            });

        } catch (err) {
            console.warn('GitHub API fetch failed:', err);
            projectsGrid.innerHTML = `<p class="col-span-2 text-center" style="color: var(--text-muted);">Could not load projects. <a href="https://github.com/${GITHUB_USERNAME}" style="color: var(--accent-color);">View on GitHub →</a></p>`;
        }
    }

    // GitHub contribution graph — animated heartbeat canvas
    const contribCanvas = document.getElementById('contribution-canvas');
    const contribCtx = contribCanvas.getContext('2d');
    const contribFallback = document.getElementById('github-graph-fallback');
    let contribData = null;

    async function fetchContribData() {
        try {
            const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`);
            if (!res.ok) throw new Error('API error');
            const events = await res.json();

            const days = 30;
            const buckets = new Array(days).fill(0);
            const now = Date.now();
            const msPerDay = 86400000;

            events.forEach(ev => {
                const age = now - new Date(ev.created_at).getTime();
                const dayIndex = days - 1 - Math.floor(age / msPerDay);
                if (dayIndex >= 0 && dayIndex < days) buckets[dayIndex]++;
            });

            contribData = buckets;
            drawContribGraph(false);
        } catch (err) {
            contribFallback.style.display = 'block';
            contribFallback.textContent = 'Could not load contribution data. View on GitHub instead.';
        }
    }

    function drawContribGraph(animate) {
        if (!contribData || !contribCanvas) return;
        const container = contribCanvas.parentElement;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) {
            // Retry after a short delay if container isn't laid out yet
            setTimeout(() => drawContribGraph(animate), 200);
            return;
        }
        const dpr = window.devicePixelRatio || 1;
        contribCanvas.width = w * dpr;
        contribCanvas.height = h * dpr;
        contribCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const maxVal = Math.max(...contribData, 1);
        const points = contribData.map((v, i) => ({
            x: padding.left + (i / (contribData.length - 1)) * chartW,
            y: padding.top + chartH - (v / maxVal) * chartH
        }));

        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        const accentColor = isDark ? '#38bdf8' : '#0D47A1';
        const mutedColor = isDark ? 'rgba(203,213,225,0.3)' : 'rgba(0,0,0,0.1)';
        const textColor = isDark ? '#94a3b8' : '#64748b';
        const areaColor = isDark ? 'rgba(56,189,248,0.1)' : 'rgba(13,71,161,0.08)';

        let progress = 0;
        const totalFrames = animate ? 60 : 1;

        function draw() {
            progress++;
            const t = Math.min(progress / totalFrames, 1);
            const eased = animate ? (1 - Math.pow(1 - t, 3)) : 1;
            const visiblePoints = Math.max(2, Math.floor(eased * points.length));

            contribCtx.clearRect(0, 0, w, h);

            // Grid lines
            contribCtx.strokeStyle = mutedColor;
            contribCtx.lineWidth = 0.5;
            for (let i = 0; i <= 4; i++) {
                const y = padding.top + (chartH / 4) * i;
                contribCtx.beginPath();
                contribCtx.moveTo(padding.left, y);
                contribCtx.lineTo(w - padding.right, y);
                contribCtx.stroke();
            }

            // Y-axis labels
            contribCtx.fillStyle = textColor;
            contribCtx.font = '10px Inter, sans-serif';
            contribCtx.textAlign = 'right';
            for (let i = 0; i <= 4; i++) {
                const val = Math.round((maxVal / 4) * (4 - i));
                const y = padding.top + (chartH / 4) * i;
                contribCtx.fillText(val, padding.left - 8, y + 3);
            }

            // X-axis labels (every 7 days)
            contribCtx.textAlign = 'center';
            for (let i = 0; i < contribData.length; i += 7) {
                const d = new Date(Date.now() - (contribData.length - 1 - i) * 86400000);
                const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                contribCtx.fillText(label, points[i].x, h - 8);
            }

            // Smooth curve through points
            contribCtx.beginPath();
            contribCtx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < visiblePoints; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const cpx = (prev.x + curr.x) / 2;
                contribCtx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
            }

            // Area fill
            const lastVisible = points[visiblePoints - 1];
            contribCtx.lineTo(lastVisible.x, padding.top + chartH);
            contribCtx.lineTo(points[0].x, padding.top + chartH);
            contribCtx.closePath();
            contribCtx.fillStyle = areaColor;
            contribCtx.fill();

            // Line stroke
            contribCtx.beginPath();
            contribCtx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < visiblePoints; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const cpx = (prev.x + curr.x) / 2;
                contribCtx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
            }
            contribCtx.strokeStyle = accentColor;
            contribCtx.lineWidth = 2;
            contribCtx.stroke();

            // Glow on the leading point
            if (visiblePoints > 0) {
                const tip = points[visiblePoints - 1];
                contribCtx.beginPath();
                contribCtx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
                contribCtx.fillStyle = accentColor;
                contribCtx.fill();
                contribCtx.beginPath();
                contribCtx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
                contribCtx.fillStyle = isDark ? 'rgba(56,189,248,0.2)' : 'rgba(13,71,161,0.15)';
                contribCtx.fill();
            }

            // Data point dots
            for (let i = 0; i < visiblePoints; i++) {
                contribCtx.beginPath();
                contribCtx.arc(points[i].x, points[i].y, 2.5, 0, Math.PI * 2);
                contribCtx.fillStyle = accentColor;
                contribCtx.fill();
            }

            if (progress < totalFrames) requestAnimationFrame(draw);
        }

        draw();
    }

    fetchGitHubData();
    fetchContribData();

    // Redraw graph on theme change (no re-animation, just redraw)
    themeToggleBtn.addEventListener('click', () => {
        setTimeout(() => { if (contribData) drawContribGraph(false); }, 100);
    });

    // Redraw on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { if (contribData) drawContribGraph(false); }, 200);
    });

    // Scroll down arrow
    const scrollDownBtn = document.getElementById('scroll-down');
    if (scrollDownBtn) {
        const scrollDownHandler = () => {
            const next = document.getElementById('about') || document.querySelector('.scroll-target:not(#hero .scroll-target)');
            if (next) next.scrollIntoView({ behavior: 'smooth' });
        };
        scrollDownBtn.addEventListener('click', scrollDownHandler);
        scrollDownBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollDownHandler(); }
        });
    }
});
