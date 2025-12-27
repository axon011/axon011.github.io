document.addEventListener('DOMContentLoaded', () => {
    // === Theme Toggling ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check local storage or system preference
    if (localStorage.getItem('theme') === 'dark' || 
       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // === Typing effect for tagline ===
    const taglineEl = document.getElementById('tagline');
    const taglineText = "Edge ViT Systems & LLMs";
    let charIndex = 0;

    function type() {
        if (charIndex < taglineText.length) {
            taglineEl.textContent += taglineText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                taglineEl.textContent = '';
                charIndex = 0;
                type();
            }, 5000); // Re-types after 5 seconds
        }
    }
    type();

    // === Scroll animations for sections ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const targets = document.querySelectorAll('.scroll-target');
    targets.forEach(target => {
        observer.observe(target);
    });

    // === Dynamic cursor glow effect ===
    const cursorGlow = document.getElementById('cursor-glow');
    window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.top = `${e.clientY}px`;
            cursorGlow.style.left = `${e.clientX}px`;
            // Using top/left with CSS transform translate(-50%, -50%) 
            // is better handled in CSS, but let's ensure it follows mouse
            // The CSS has transform: translate(-50%, -50%), so we just set top/left to client coords
        });
    });
    
    // === AI Neural Net Background Animation ===
    const canvas = document.getElementById('neural-net-bg');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

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
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.baseX = this.x; 
            this.baseY = this.y; 
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            const colors = getThemeColors();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            // Use alpha for particles
            ctx.fillStyle = colors.particle; 
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        update() {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.dy = -this.dy;
            }
            
            let dxMouse = mouse.x - this.x;
            let dyMouse = mouse.y - this.y;
            let distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            let forceDirectionX = dxMouse / distance;
            let forceDirectionY = dyMouse / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            
            if (distance < mouse.radius) {
                this.x -= forceDirectionX * force * this.density * 0.5;
                this.y -= forceDirectionY * force * this.density * 0.5;
            } else {
                if (this.x !== this.baseX) {
                    let dxBase = this.x - this.baseX;
                    this.x -= dxBase / 20;
                }
                if (this.y !== this.baseY) {
                    let dyBase = this.y - this.baseY;
                    this.y -= dyBase / 20;
                }
                this.x += this.dx;
                this.y += this.dy;
            }

            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let dx = (Math.random() * 0.4) - 0.2;
            let dy = (Math.random() * 0.4) - 0.2;
            particles.push(new Particle(x, y, dx, dy, size));
        }
    }

    function connectParticles() {
        const colors = getThemeColors();
        let opacityValue = 1;
        // Convert hex to rgb to handle opacity manually if needed, 
        // but let's assume valid CSS colors are returned.
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = colors.line;
                    ctx.globalAlpha = opacityValue > 0 ? opacityValue : 0;
                    ctx.lineWidth = 1;
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
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connectParticles();
    }

    initParticles();
    animate();
});
