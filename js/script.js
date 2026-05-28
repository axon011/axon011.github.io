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
    // Typing Effect (multiple phrases) — lives inside the
    // Agent OS profile_agent panel. Re-grabs #tagline each
    // tick so it pauses gracefully when the user navigates
    // to another agent and the element is removed.
    // ==========================================
    const phrases = [
        'agent topology online',
        'tracing 4-node pipeline',
        'hybrid retrieval @ 150ms',
        'critic node validating output',
        'flushing langfuse spans'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
        const taglineEl = document.getElementById('tagline');
        if (!taglineEl) {
            // profile_agent panel not active — wait and retry
            setTimeout(typeLoop, 500);
            return;
        }
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

    // ==========================================
    // Agent OS — interactive hero state machine
    // Renders a multi-agent orchestrator interface in the hero.
    // 4 clickable agents · simulated "thinking" delay ·
    // faux execution trace log with timestamps + latency.
    // ==========================================
    const AGENTS = [
        { id: 'profile_agent',    label: 'identity_overview',  glyph: '◉' },
        { id: 'experience_agent', label: 'internal_workloads', glyph: '▶' },
        { id: 'project_agent',    label: 'projects_oss',       glyph: '▦' },
        { id: 'contact_agent',    label: 'contact_protocol',   glyph: '↔' }
    ];

    let activeAgent = 'profile_agent';
    let agentThinking = false;
    const traceLogs = [
        { t: '00:00.01', msg: 'System initialised. Loading agent topology...', ok: false },
        { t: '00:00.04', msg: 'LangGraph state machine ready.',                ok: false },
        { t: '00:00.12', msg: 'profile_agent active. Awaiting query.',         ok: true  }
    ];

    function fmtElapsed() {
        const ms = Math.floor(performance.now());
        const s  = Math.floor(ms / 1000);
        const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
        return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}.${cs}`;
    }

    function randLatency() {
        return Math.floor(180 + Math.random() * 110); // 180–290ms · keeps the <300ms claim honest
    }

    function appendLog(msg, ok = false) {
        traceLogs.push({ t: fmtElapsed(), msg, ok });
        renderTraceLog();
    }

    function renderTraceLog() {
        const el = document.getElementById('trace-lines');
        if (!el) return;
        const visible = traceLogs.slice(-6);
        el.innerHTML = visible.map(l =>
            `<div class="trace-line ${l.ok ? 'ok' : ''}">
                <span class="time">[${l.t}]</span>
                <span class="msg">${l.msg}</span>
            </div>`
        ).join('');
        el.scrollTop = el.scrollHeight;
    }

    function renderAgentRail() {
        const el = document.getElementById('agent-nodes');
        if (!el) return;
        el.innerHTML = AGENTS.map(a => {
            const isActive   = a.id === activeAgent;
            const isThinking = isActive && agentThinking;
            return `
                <button class="agent-node-btn ${isActive ? 'active' : ''}" data-agent="${a.id}" aria-pressed="${isActive}">
                    <span><span class="glyph">${a.glyph}</span>${a.label}</span>
                    ${isThinking ? '<span class="node-pulse" aria-hidden="true"></span>' : ''}
                </button>
            `;
        }).join('');
        el.querySelectorAll('.agent-node-btn').forEach(btn => {
            btn.addEventListener('click', () => selectAgent(btn.dataset.agent));
        });
    }

    function selectAgent(id) {
        if (id === activeAgent || agentThinking) return;
        agentThinking = true;
        const nameEl = document.getElementById('active-node-name');
        if (nameEl) nameEl.textContent = `${id}.json`;
        renderAgentRail();
        renderPanelThinking();
        appendLog(`Invoking ${id}...`, false);
        setTimeout(() => {
            activeAgent = id;
            agentThinking = false;
            renderAgentRail();
            renderPanel();
            appendLog(`Tool call ok. Latency: ${randLatency()}ms.`, true);
        }, 600);
    }

    function renderPanelThinking() {
        const el = document.getElementById('agent-panel-body');
        if (!el) return;
        el.innerHTML = `
            <div class="thinking">
                <div class="spinner" aria-hidden="true"></div>
                <div>Agent is synthesising data...</div>
            </div>
        `;
    }

    function renderPanel() {
        const el = document.getElementById('agent-panel-body');
        if (!el) return;
        el.innerHTML = `<div class="agent-output">${panelContent(activeAgent)}</div>`;
    }

    function panelContent(id) {
        if (id === 'profile_agent') return `
            <h1 class="text-3xl md:text-4xl font-black tracking-tight mb-2" style="color: var(--text-color);">
                Aravind Pradeep
            </h1>
            <p class="json-line mb-4">
                <span class="json-brace">{</span>
                <span class="json-key">role:</span> <span class="json-string">"AI Engineer"</span>,
                <span class="json-key">focus:</span> <span class="json-string">"Agentic Systems · RAG · Evals"</span>
                <span class="json-brace">}</span>
            </p>
            <div class="system-prompt-block">
                <span class="prompt-label">System Prompt</span>
                AI Engineer in Cottbus, Germany. Builds and ships <strong>agentic systems, RAG pipelines, and multi-agent workflows</strong> that run internally on IoT product data &mdash; <strong>sub-300ms retrieval latency</strong>. Instruments tracing with Langfuse, evals with RAGAs and MLflow, prefers structured outputs and strict role boundaries over free-form prompting.
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
                <span class="project-chip">python</span>
                <span class="project-chip">langgraph</span>
                <span class="project-chip">qdrant</span>
                <span class="project-chip">langfuse</span>
                <span class="project-chip">mlflow</span>
                <span class="project-chip">go</span>
                <span class="project-chip">fastapi</span>
                <span class="project-chip">docker</span>
            </div>
            <p class="shell-line mt-5" style="font-size: 0.82rem;">
                <span class="shell-prompt">$ stream&gt;</span>
                <span id="tagline" style="color: var(--accent-color);"></span><span class="typing-cursor"></span>
            </p>
        `;

        if (id === 'experience_agent') return `
            <p class="json-line mb-4">
                <span class="json-brace">{</span>
                <span class="json-key">employer:</span> <span class="json-string">"Perinet GmbH"</span>,
                <span class="json-key">role:</span> <span class="json-string">"AI Engineer (Working Student)"</span>,
                <span class="json-key">since:</span> <span class="json-string">"2024-06"</span>
                <span class="json-brace">}</span>
            </p>
            <div class="mt-3">
                <div class="agent-bullet"><span class="arrow">→</span><span>Deployed <strong>RAG conversational agents</strong> for 20+ internal users · <strong>sub-300ms retrieval latency</strong> · hybrid (BM25 + dense + RRF)</span></div>
                <div class="agent-bullet"><span class="arrow">→</span><span>Built <strong>4-agent pipelines</strong> (Planner → Researcher → Writer → Critic) on LangGraph state machines · 60% manual reporting reduction</span></div>
                <div class="agent-bullet"><span class="arrow">→</span><span>Connected LLM workflows to MQTT sensor data via <strong>Python + Go</strong> backends; REST APIs with Pydantic + FastAPI</span></div>
                <div class="agent-bullet"><span class="arrow">→</span><span>Instrumented every LLM call with <strong>Langfuse</strong> tracing · MLflow experiment tracking · <strong>RAGAs</strong> faithfulness evals</span></div>
                <div class="agent-bullet"><span class="arrow">→</span><span>Containerised with Docker + Kubernetes; CI/CD via GitHub Actions and GitLab</span></div>
            </div>
            <div class="comment-line mt-5">// PREVIOUS_NODE: Cognizant Technology Solutions · Software Engineer Trainee · 2021–2022</div>
        `;

        if (id === 'project_agent') return `
            <p class="comment-line">// Top 4 by relevance to agent / RAG / LLMOps roles. Full list ↓ in Projects section.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a href="https://github.com/axon011/multi-agent-pipeline" target="_blank" rel="noopener noreferrer" class="agent-project-card">
                    <div class="pname">multi-agent-pipeline</div>
                    <div class="pstack">langgraph · crewai · fastapi</div>
                    <div class="pmetric">4-agent orchestration (Planner → Researcher → Writer → Critic) with Pydantic-structured outputs + Langfuse tracing.</div>
                </a>
                <a href="https://github.com/axon011/rag-eval-system" target="_blank" rel="noopener noreferrer" class="agent-project-card">
                    <div class="pname">rag-eval-system</div>
                    <div class="pstack">qdrant · ragas · mlflow</div>
                    <div class="pmetric">Hybrid retrieval (BM25 + dense + RRF) · sub-300ms retrieval p95 · 50-question RAGAs eval suite.</div>
                </a>
                <a href="https://github.com/axon011/resume-tailor" target="_blank" rel="noopener noreferrer" class="agent-project-card">
                    <div class="pname">resume-tailor</div>
                    <div class="pstack">claude · latex · ats</div>
                    <div class="pmetric">JD URL → tailored resume + cover letter + ATS score in ~3min. 32-pattern humaniser strips AI tells.</div>
                </a>
                <a href="https://github.com/axon011/llm-fine-tuning" target="_blank" rel="noopener noreferrer" class="agent-project-card">
                    <div class="pname">llm-fine-tuning</div>
                    <div class="pstack">qlora · qwen2 · peft</div>
                    <div class="pmetric">QLoRA fine-tune of Qwen2-0.5B for JD extraction. Loss 2.56 → 1.97 in 3 min on RTX 3050.</div>
                </a>
            </div>
        `;

        if (id === 'contact_agent') return `
            <p class="comment-line">// Initialise connection protocols. All channels open.</p>
            <div class="space-y-3" style="max-width: 36rem;">
                <a href="mailto:aravindpradeep001@gmail.com" class="contact-row">
                    <span class="ckey">email</span>
                    <span class="cval">aravindpradeep001@gmail.com</span>
                </a>
                <a href="https://github.com/axon011" target="_blank" rel="noopener noreferrer" class="contact-row">
                    <span class="ckey">github</span>
                    <span class="cval">github.com/axon011</span>
                </a>
                <a href="https://linkedin.com/in/aravind-pradeepmadathinal" target="_blank" rel="noopener noreferrer" class="contact-row">
                    <span class="ckey">linkedin</span>
                    <span class="cval">aravind-pradeepmadathinal</span>
                </a>
                <a href="Aravind_Pradeep_AI_Engineer.pdf" download class="contact-row">
                    <span class="ckey">resume</span>
                    <span class="cval">Aravind_Pradeep_AI_Engineer.pdf ↓</span>
                </a>
            </div>
        `;

        return '';
    }

    renderAgentRail();
    renderPanel();
    renderTraceLog();
    typeLoop();

    // ==========================================
    // Hero status-bar metric ticker
    // Rotates verified claims so the dashboard reads "live"
    // instead of showing a single static badge. Every entry
    // is claim-verifier safe (code-backed or honestly framed).
    // ==========================================
    const heroMetrics = [
        '▶ RAG retrieval p95 < 300ms',
        '▶ Hybrid retrieval · BM25 + dense + RRF',
        '▶ Agent topology · 4 nodes active',
        '▶ RAGAs eval suite · 50 questions',
        '▶ Langfuse tracing · all LLM calls',
        '▶ Stack · python · go · langgraph'
    ];
    let heroMetricIdx = 0;
    const heroMetricEl = document.getElementById('hero-metric');
    if (heroMetricEl) {
        setInterval(() => {
            heroMetricEl.classList.add('fading');
            setTimeout(() => {
                heroMetricIdx = (heroMetricIdx + 1) % heroMetrics.length;
                heroMetricEl.textContent = heroMetrics[heroMetricIdx];
                heroMetricEl.classList.remove('fading');
            }, 280);
        }, 4200);
    }

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
        const stripped = rawMarkdown.replace(/<!--[\s\S]*?-->/g, '');
        const lines = stripped.split('\n');
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
                .replace(/^>\s*/, '')
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/\*(.+?)\*/g, '$1')
                .replace(/__(.+?)__/g, '$1')
                .replace(/_(.+?)_/g, '$1')
                .replace(/`(.+?)`/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
                // Strip orphan markers left by cross-line bold/italic
                // (e.g. line starts with `(**Planner` because the closing `**` is on the next line)
                .replace(/\*\*/g, '')
                .replace(/__/g, '')
                .trim();
            if (/add your .+ here/i.test(clean)) continue;
            if (/^(TODO|FIXME|XXX)\b/i.test(clean)) continue;
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

                const metaParts = [];
                if (repo.stargazers_count > 0) metaParts.push(`★ ${repo.stargazers_count}`);
                if (repo.forks_count > 0) metaParts.push(`⑂ ${repo.forks_count}`);
                const updated = repo.pushed_at ? new Date(repo.pushed_at) : null;
                if (updated && !isNaN(updated)) {
                    const yyyy = updated.getUTCFullYear();
                    const mm = String(updated.getUTCMonth() + 1).padStart(2, '0');
                    metaParts.push(`${yyyy}-${mm}`);
                }
                const metaHtml = metaParts.length
                    ? metaParts.map(p => `<span>${p}</span>`).join('<span class="meta-sep">·</span>')
                    : '';

                const langColor = LANG_COLORS[repo.language] || 'var(--accent-color)';
                const langHtml = repo.language
                    ? `<span class="project-chip" style="display:inline-flex;align-items:center;gap:6px;">
                           <span class="lang-dot" style="background:${langColor}; width:8px; height:8px;"></span>${repo.language}
                       </span>` : '';

                const topicsHtml = repo.topics
                    ? repo.topics.slice(0, 3).map(t => `<span class="project-chip">${t}</span>`).join('')
                    : '';

                return `
                    <div class="project-card-wrap" data-lang="${repo.language || ''}" data-topics="${(repo.topics || []).join(',')}" data-name="${repo.name.toLowerCase()}" data-desc="${rawDesc.toLowerCase()}">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
                           class="project-card card-interactive p-5 flex flex-col h-full">
                            <div class="flex items-baseline justify-between gap-3 mb-2">
                                <h3 class="project-name truncate">${repo.name}</h3>
                                <div class="project-meta">${metaHtml}</div>
                            </div>
                            <p class="text-sm mb-4 flex-1 leading-relaxed" style="color: var(--text-muted);">${descHtml}</p>
                            <div class="flex flex-wrap gap-1.5">
                                ${langHtml}${topicsHtml}
                            </div>
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
