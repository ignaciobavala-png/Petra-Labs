// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Scroll-triggered staggered animation para "Cómo trabajamos"
const procesosContainer = document.querySelector('.procesos');
const procesosItems = document.querySelectorAll('.proceso');

if (procesosContainer && procesosItems.length > 0) {
    const procesosObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            procesosItems.forEach((proceso, index) => {
                setTimeout(() => {
                    proceso.classList.add('active');
                }, index * 700);
            });
            procesosObserver.disconnect();
        }
    }, { threshold: 0.2 });

    procesosObserver.observe(procesosContainer);
}

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Hero Canvas — Bubble Animation (fine, large, sparse)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let w, h;
    let mouse = { x: -9999, y: -9999 };
    let animId;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        w = rect.width;
        h = rect.height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createBubbles() {
        bubbles = [];
        // Very sparse grid — few elegant bubbles
        const cols = Math.ceil(w / 260);
        const rows = Math.ceil(h / 220);
        const spacingX = w / (cols + 1);
        const spacingY = h / (rows + 1);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const isAccent = Math.random() > 0.7;
                const rowOffset = c % 2 === 0 ? 0 : spacingY * 0.35;
                const baseRadius = Math.random() * 30 + 20;
                bubbles.push({
                    baseX: spacingX * (c + 1) + (Math.random() - 0.5) * spacingX * 0.5,
                    baseY: spacingY * (r + 1) + rowOffset + (Math.random() - 0.5) * spacingY * 0.4,
                    x: spacingX * (c + 1),
                    y: spacingY * (r + 1) + rowOffset,
                    vx: 0,
                    vy: 0,
                    radius: baseRadius,
                    phase: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.12 + 0.06,
                    isAccent,
                });
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const time = Date.now() * 0.001;

        // Draw thin connections between nearby bubbles
        for (let i = 0; i < bubbles.length; i++) {
            for (let j = i + 1; j < bubbles.length; j++) {
                const a = bubbles[i];
                const b = bubbles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 280;

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.55;
                    ctx.stroke();
                }
            }
        }

        // Update and draw bubbles
        for (const b of bubbles) {
            const pulse = Math.sin(time * b.speed + b.phase) * 0.3 + 0.7;
            // Slow, wide drift for elegant movement
            const driftX = Math.sin(time * 0.15 + b.phase) * 22;
            const driftY = Math.cos(time * 0.12 + b.phase * 1.3) * 18;

            const tx = b.baseX + driftX;
            const ty = b.baseY + driftY;

            // Mouse interaction — gentle push
            const dx = mouse.x - b.x;
            const dy = mouse.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseForce = dist < 250 ? (1 - dist / 250) * 0.12 : 0;

            b.vx += (tx - b.x) * 0.012 + dx * mouseForce * 0.008;
            b.vy += (ty - b.y) * 0.012 + dy * mouseForce * 0.008;
            b.vx *= 0.88;
            b.vy *= 0.88;
            b.x += b.vx;
            b.y += b.vy;

            const r = b.radius * (0.9 + pulse * 0.12);
            const strokeAlpha = 0.2 + pulse * 0.12;

            // Fine bubble stroke (thin circle outline)
            ctx.beginPath();
            ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
            if (b.isAccent) {
                ctx.strokeStyle = `rgba(200, 240, 60, ${strokeAlpha})`;
                ctx.fillStyle = `rgba(200, 240, 60, ${strokeAlpha * 0.08})`;
            } else {
                ctx.strokeStyle = `rgba(255, 255, 255, ${strokeAlpha * 0.6})`;
                ctx.fillStyle = `rgba(255, 255, 255, ${strokeAlpha * 0.06})`;
            }
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();

            // Small highlight dot at top-left of bubble
            if (r > 18) {
                const hlX = b.x - r * 0.3;
                const hlY = b.y - r * 0.3;
                const hlR = r * 0.095;
                const hlAlpha = strokeAlpha * 0.5;
                ctx.beginPath();
                ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
                ctx.fillStyle = b.isAccent
                    ? `rgba(255, 255, 255, ${hlAlpha * 0.75})`
                    : `rgba(255, 255, 255, ${hlAlpha})`;
                ctx.fill();
            }
        }

        animId = requestAnimationFrame(draw);
    }

    function onMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        if (cx >= 0 && cx <= rect.width && cy >= 0 && cy <= rect.height) {
            mouse.x = cx;
            mouse.y = cy;
        }
    }

    function init() {
        resize();
        createBubbles();
        if (animId) cancelAnimationFrame(animId);
        draw();
    }

    window.addEventListener('resize', () => {
        resize();
        createBubbles();
    });
    window.addEventListener('mousemove', onMouse);

    init();
}
