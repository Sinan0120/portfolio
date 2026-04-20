document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const iconDark = document.getElementById('theme-icon-dark');
    const iconLight = document.getElementById('theme-icon-light');

    // Retrieve saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Toggle Icons
        if (theme === 'light') {
            iconLight.classList.add('d-none');
            iconDark.classList.remove('d-none');
        } else {
            iconDark.classList.add('d-none');
            iconLight.classList.remove('d-none');
        }
    }


    // Smooth scrolling for navigation links
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

    // Liquid glowing hover/touch enhancements based on position
    const dynamicElements = document.querySelectorAll('.glass-card, .glass-btn, .glass-pill, .skill-box, .project-card-minimal');

    dynamicElements.forEach(el => {
        const updatePosition = (e) => {
            const rect = el.getBoundingClientRect();
            // Determine coordinate source (mouse or touch)
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

    // Subtly animate navbar blur on scroll
    const navbar = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        if (window.scrollY > 50) {
            navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)';
            navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
            navbar.style.borderBottom = isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.borderBottom = '1px solid transparent';
        }
    });

    // Blob parallax tracking effect
    const blobs = document.querySelectorAll('.liquid-blob');
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
            // Normalized coordinates (-1 to 1)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            blobs.forEach((blob, index) => {
                // Different speed for depth effect
                const speedX = (index + 1) * 30;
                const speedY = (index + 1) * 30;

                // Add soft drifting based on mouse pos
                blob.style.transform = `translate(${x * speedX}px, ${y * speedY}px)`;
            });
        });
    });

    // --- Interactive Project Cards Modal ---
    const projectCards = document.querySelectorAll('.bento-interactive');
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Modal Elements
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalIconBox = document.getElementById('modalIconBox');
    const modalIcon = document.getElementById('modalIcon');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Populate data
            const title = card.getAttribute('data-bs-title');
            const imgSrc = card.getAttribute('data-bs-img');
            const desc = card.getAttribute('data-bs-desc');
            const techStr = card.getAttribute('data-bs-tech');
            const iconClass = card.getAttribute('data-bs-icon');
            const colorClass = card.getAttribute('data-bs-color');

            modalTitle.textContent = title;
            modalImg.src = imgSrc;
            modalDesc.textContent = desc;

            // Icon Setup
            modalIconBox.className = `project-icon-box shadow-sm flex-shrink-0 ${colorClass}`;
            modalIcon.className = `bi ${iconClass} text-white fs-5`;

            // Tech Stack Setup
            modalTechStack.innerHTML = '';
            if (techStr) {
                techStr.split(',').forEach(tech => {
                    const span = document.createElement('span');
                    span.className = 'tech-pill';
                    span.textContent = tech.trim();
                    modalTechStack.appendChild(span);
                });
            }

            // Show Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent scrolling
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Typewriter Effect ---
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const roles = [
            "Front End Developer",
            "Back End Developer",
            "UI/UX Designer"
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 1500; // Wait before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Wait before typing next
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000); // Initial start delay
    }

    // --- Minimal Scroll Parallax Animation ---
    const parallaxElements = document.querySelectorAll('.bento-card, .skill-box, .cta-form-card, .cta-left-card, .cta-info-card, .about-avatar-box');
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    // Check if element is reasonably visible
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        // Calculate slight offset based on distance from viewport center
                        const elementCenterY = rect.top + rect.height / 2;
                        const viewportCenterY = window.innerHeight / 2;
                        const offset = (viewportCenterY - elementCenterY) * 0.05; // very subtle 5% movement
                        
                        el.style.transform = `translateY(${offset}px)`;
                        // Use a subtle ease-out for smoothness
                        el.style.transition = 'transform 0.3s ease-out';
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

});
