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
