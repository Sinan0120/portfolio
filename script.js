document.addEventListener("DOMContentLoaded", () => {
    // --- Theme Toggle Logic ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const iconDark = document.getElementById('theme-icon-dark');
    const iconLight = document.getElementById('theme-icon-light');

    // Retrieve saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Toggle Icons
        if (iconLight && iconDark) {
            if (theme === 'light') {
                iconLight.classList.add('d-none');
                iconDark.classList.remove('d-none');
            } else {
                iconDark.classList.add('d-none');
                iconLight.classList.remove('d-none');
            }
        }
    }

    // --- Smooth Scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Liquid glowing hover/touch enhancements ---
    const dynamicElements = document.querySelectorAll('.glass-card, .glass-btn, .glass-pill, .skill-box, .project-card-minimal, .bento-card');
    dynamicElements.forEach(el => {
        const updatePosition = (e) => {
            const rect = el.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        };
        el.addEventListener('mousemove', updatePosition);
        el.addEventListener('touchmove', updatePosition, { passive: true });
        el.addEventListener('touchstart', updatePosition, { passive: true });
    });

    // --- Blob parallax tracking effect ---
    const blobs = document.querySelectorAll('.liquid-blob');
    let rafId = null;
    document.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 30;
                blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    });

    // --- Interactive Project Cards Modal ---
    const projectCards = document.querySelectorAll('.bento-interactive');
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modal && projectCards.length > 0) {
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalTechStack = document.getElementById('modalTechStack');
        const modalIconBox = document.getElementById('modalIconBox');
        const modalIcon = document.getElementById('modalIcon');

        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                modalTitle.textContent = card.getAttribute('data-bs-title');
                modalImg.src = card.getAttribute('data-bs-img');
                modalDesc.textContent = card.getAttribute('data-bs-desc');
                
                const iconClass = card.getAttribute('data-bs-icon') || 'bi-laptop';
                const colorClass = card.getAttribute('data-bs-color') || 'bg-accent-blue';
                modalIconBox.className = `project-icon-box shadow-sm flex-shrink-0 ${colorClass}`;
                modalIcon.className = `bi ${iconClass} text-white fs-5`;

                const techStr = card.getAttribute('data-bs-tech');
                modalTechStack.innerHTML = '';
                if (techStr) {
                    techStr.split(',').forEach(tech => {
                        const span = document.createElement('span');
                        span.className = 'tech-pill';
                        span.textContent = tech.trim();
                        modalTechStack.appendChild(span);
                    });
                }
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
});
