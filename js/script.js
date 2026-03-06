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
        'Agentic Systems & RAG',
        'Edge ViT Systems & LLMs',
        'Multi-Agent Pipelines',
        'LLMOps & Observability',
        'Full-Stack GenAI Apps'
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
                // Animate skill bars within this section
                entry.target.querySelectorAll('.skill-bar').forEach(bar => {
                    bar.style.width = bar.dataset.width + '%';
                });
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-target').forEach(t => observer.observe(t));

    // ==========================================
    // Active Nav Highlighting
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-top');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => navObserver.observe(s));

    // ==========================================
    // Cursor Glow (desktop only)
    // ==========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.top = e.clientY + 'px';
                cursorGlow.style.left = e.clientX + 'px';
            });
        });
    }

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
            ctx.globalAlpha = 0.4;
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
        const count = Math.min((canvas.width * canvas.height) / 12000, 120);
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
    // Interactive Terminal
    // ==========================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const commands = {
        help: () => `Available commands:
  <span class="terminal-prompt">about</span>     - Who am I
  <span class="terminal-prompt">skills</span>    - Technical skills
  <span class="terminal-prompt">projects</span>  - Key projects
  <span class="terminal-prompt">contact</span>   - How to reach me
  <span class="terminal-prompt">education</span> - Academic background
  <span class="terminal-prompt">experience</span>- Work experience
  <span class="terminal-prompt">resume</span>    - Download resume
  <span class="terminal-prompt">github</span>    - Open GitHub profile
  <span class="terminal-prompt">clear</span>     - Clear terminal`,

        about: () => `<span style="color: var(--accent-color);">Aravind Pradeep</span> - Junior AI Engineer

  Specializing in <strong>agentic systems, multi-agent pipelines,
  and production RAG architectures</strong>.

  M.Sc. in AI from BTU Cottbus. Currently at Perinet GmbH
  building LLM-powered workflows for IoT products.

  Stack: Python, LangChain, LangGraph, FastAPI, Docker/K8s
  Focus: GenAI, LLMOps, Full-Stack AI Applications`,

        skills: () => `<span style="color: var(--accent-color);">Technical Skills:</span>

  AI/Agents:   LangGraph, CrewAI, RAG, ReAct, Prompt Eng.
  LLMOps:      Langfuse, MLflow, RAGAs, A/B evaluation
  Python/ML:   PyTorch, HuggingFace, OpenAI/Anthropic APIs
  Backend:     FastAPI, Golang, REST, MQTT, SSE streaming
  Vector DBs:  Qdrant, ChromaDB, pgvector
  Cloud/DevOps:Docker, K8s, GitHub Actions, Azure, AWS
  Frontend:    React, TypeScript, JavaScript
  Data/DB:     PostgreSQL, MySQL, SQL`,

        projects: () => `<span style="color: var(--accent-color);">Key Projects:</span>

  1. Multi-Agent Research Pipeline
     LangGraph + CrewAI + FastAPI + Docker

  2. Production RAG System with Eval Harness
     FastAPI + Qdrant + RAGAs + MLflow

  3. LLMOps Observability Dashboard
     Langfuse + React/TS + PostgreSQL + AWS

  4. GenAI Study Assistant (Live on Azure)
     FastAPI + React + GPT-4o + SSE

  5. Content-Aware ViT on Edge (M.Sc. Thesis)
     PyTorch + ONNX + ARM optimization`,

        contact: () => `<span style="color: var(--accent-color);">Contact:</span>

  Email:    aravindpradeep001@gmail.com
  LinkedIn: linkedin.com/in/aravind-pradeepmadathinal
  GitHub:   github.com/axon011
  Location: Cottbus, Germany`,

        education: () => `<span style="color: var(--accent-color);">Education:</span>

  M.Sc. Artificial Intelligence (Research)
  Brandenburg University of Technology, Cottbus
  Oct 2023 - Est. Dec 2025

  B.Sc. Computer Application
  BVM Holy Cross College, India
  Jul 2018 - Mar 2021`,

        experience: () => `<span style="color: var(--accent-color);">Experience:</span>

  Working Student - AI Integration & Agentic Systems
  Perinet GmbH | Cottbus | Jun 2024 - Present
  > RAG agents, LLM workflows, Docker/K8s, Langfuse

  Software Engineer Trainee
  Cognizant Technology Solutions | India | Oct 2021 - Aug 2022
  > Enterprise systems, agile teams, debugging`,

        resume: () => {
            window.open('AI Product Engineer.pdf', '_blank');
            return 'Opening resume PDF...';
        },

        github: () => {
            window.open('https://github.com/' + GITHUB_USERNAME, '_blank');
            return 'Opening GitHub profile...';
        },

        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        }
    };

    function addTerminalLine(text, isCommand) {
        if (text === null) return;
        const line = document.createElement('div');
        line.classList.add('terminal-line');
        if (isCommand) {
            line.innerHTML = `<span class="terminal-prompt">$ </span><span>${text}</span>`;
        } else {
            line.innerHTML = `<pre class="terminal-response" style="white-space:pre-wrap;margin:0;font-family:inherit;">${text}</pre>`;
        }
        terminalOutput.appendChild(line);
        const body = document.getElementById('terminal-body');
        body.scrollTop = body.scrollHeight;
    }

    // Auto-run intro
    addTerminalLine('Welcome! Type <span class="terminal-prompt">help</span> to see available commands.', false);

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            if (!cmd) return;

            addTerminalLine(cmd, true);

            if (commands[cmd]) {
                const result = commands[cmd]();
                if (result !== null && result !== undefined) {
                    addTerminalLine(result, false);
                }
            } else {
                addTerminalLine(`Command not found: ${cmd}. Type <span class="terminal-prompt">help</span> for available commands.`, false);
            }
        }
    });

    // ==========================================
    // GitHub API Integration
    // ==========================================
    async function fetchGitHubData() {
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
            ]);

            if (!userRes.ok || !reposRes.ok) return;

            const user = await userRes.json();
            const repos = await reposRes.json();

            // Stats
            const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
            const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

            animateCounter('stat-repos', user.public_repos || repos.length);
            animateCounter('stat-stars', totalStars);
            animateCounter('stat-forks', totalForks);
            animateCounter('stat-followers', user.followers || 0);

            // Render top repos (exclude the profile repo)
            const topRepos = repos
                .filter(r => !r.fork && r.name !== GITHUB_USERNAME + '.github.io')
                .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
                .slice(0, 4);

            const reposContainer = document.getElementById('github-repos');
            reposContainer.innerHTML = topRepos.map(repo => `
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card glassmorphism rounded-lg p-6 block">
                    <div class="flex items-start justify-between mb-3">
                        <svg class="w-7 h-7" style="color: var(--accent-color);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <div class="flex items-center gap-3 text-xs" style="color: var(--text-muted);">
                            ${repo.stargazers_count > 0 ? `<span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                ${repo.stargazers_count}
                            </span>` : ''}
                            ${repo.forks_count > 0 ? `<span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 3a3 3 0 013 3c0 1.31-.84 2.42-2 2.83V11c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V8.83c-1.16-.41-2-1.52-2-2.83a3 3 0 116 0c0 1.31-.84 2.42-2 2.83V11c0 1.65-1.35 3-3 3h-3v2.17c1.16.41 2 1.52 2 2.83a3 3 0 11-6 0c0-1.31.84-2.42 2-2.83V14H9c-1.65 0-3-1.35-3-3V8.83C4.84 8.42 4 7.31 4 6a3 3 0 012-2.83V3z"/></svg>
                                ${repo.forks_count}
                            </span>` : ''}
                        </div>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--text-color);">${repo.name}</h3>
                    <p class="text-sm mb-4" style="color: var(--text-muted);">${repo.description || 'No description'}</p>
                    <div class="flex flex-wrap gap-2">
                        ${repo.language ? `<span class="text-xs px-2 py-1 rounded" style="background: var(--accent-bg); color: var(--accent-color);">${repo.language}</span>` : ''}
                        ${repo.topics ? repo.topics.slice(0, 3).map(t => `<span class="text-xs px-2 py-1 rounded" style="background: var(--accent-bg); color: var(--accent-color);">${t}</span>`).join('') : ''}
                    </div>
                </a>
            `).join('');

        } catch (err) {
            console.warn('GitHub API fetch failed:', err);
        }
    }

    // GitHub contribution graph
    function loadContributionGraph() {
        const img = document.getElementById('github-graph');
        const fallback = document.getElementById('github-graph-fallback');
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        const theme = isDark ? 'github-dark' : 'github-light';
        img.src = `https://ghchart.rshah.org/${isDark ? '38bdf8' : '0D47A1'}/${GITHUB_USERNAME}`;
        img.onload = () => { img.style.display = 'block'; fallback.style.display = 'none'; };
        img.onerror = () => { fallback.textContent = 'Could not load contribution graph.'; };
    }

    function animateCounter(id, target) {
        const el = document.getElementById(id);
        if (!el) return;
        const duration = 1500;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    fetchGitHubData();
    loadContributionGraph();

    // Reload graph on theme change
    themeToggleBtn.addEventListener('click', () => {
        setTimeout(loadContributionGraph, 100);
    });

    // ==========================================
    // Contact Form
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            formStatus.classList.remove('hidden');
            if (res.ok) {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = '#10b981';
                contactForm.reset();
            } else {
                formStatus.textContent = 'Failed to send. Try emailing directly.';
                formStatus.style.color = '#ef4444';
            }
        } catch {
            formStatus.classList.remove('hidden');
            formStatus.textContent = 'Network error. Try emailing directly.';
            formStatus.style.color = '#ef4444';
        }
    });
});
