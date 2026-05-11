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

// Hero Canvas — Network Animation
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
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

    function createNodes() {
        nodes = [];
        const cols = Math.ceil(w / 65);
        const rows = Math.ceil(h / 55);
        const spacingX = w / (cols + 1);
        const spacingY = h / (rows + 1);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const isMain = Math.random() > 0.75;
                const rowOffset = c % 2 === 0 ? 0 : spacingY * 0.4;
                nodes.push({
                    baseX: spacingX * (c + 1),
                    baseY: spacingY * (r + 1) + rowOffset,
                    x: spacingX * (c + 1),
                    y: spacingY * (r + 1) + rowOffset,
                    vx: 0,
                    vy: 0,
                    size: isMain ? Math.random() * 2 + 3 : Math.random() * 1.5 + 1.5,
                    phase: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.25 + 0.15,
                    isMain,
                });
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const time = Date.now() * 0.001;

        // Draw connections first (behind nodes)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 160;

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(200, 240, 60, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        // Update and draw nodes
        for (const node of nodes) {
            const pulse = Math.sin(time * node.speed + node.phase) * 0.35 + 0.65;
            const driftX = Math.sin(time * 0.25 + node.phase) * 14;
            const driftY = Math.cos(time * 0.2 + node.phase * 1.3) * 14;

            const tx = node.baseX + driftX;
            const ty = node.baseY + driftY;

            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseForce = dist < 200 ? (1 - dist / 200) * 0.18 : 0;

            node.vx += (tx - node.x) * 0.018 + dx * mouseForce * 0.01;
            node.vy += (ty - node.y) * 0.018 + dy * mouseForce * 0.01;
            node.vx *= 0.85;
            node.vy *= 0.85;
            node.x += node.vx;
            node.y += node.vy;

            const radius = node.size * (0.8 + pulse * 0.3);
            const alpha = 0.35 + pulse * 0.45;

            if (node.isMain) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(26, 26, 26, ${alpha * 0.7})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 240, 60, ${alpha})`;
                ctx.shadowColor = `rgba(200, 240, 60, ${alpha * 0.6})`;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(26, 26, 26, ${alpha * 0.6})`;
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
        createNodes();
        if (animId) cancelAnimationFrame(animId);
        draw();
    }

    window.addEventListener('resize', () => {
        resize();
        createNodes();
    });
    window.addEventListener('mousemove', onMouse);

    init();
}
