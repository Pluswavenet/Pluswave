document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Modal Elements
    const modal = document.getElementById('facility-modal');
    const closeModal = document.getElementById('close-modal');
    const openModalHero = document.getElementById('open-discovery-hero');
    let modalShown = false;

    // 1. Preloader Logic
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }, 500); // Faster hide for better UX
        }
    };

    // Hide on load, but also have a safety timeout
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 3000); // 3-second safety fallback

    // 2. Mobile Menu Toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // 3. Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // 4. Scroll-Triggered Modal
    if (modal) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600 && !modalShown) {
                modal.style.display = 'flex';
                modalShown = true;
            }
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 5. Manual Modal Open
    if (openModalHero && modal) {
        openModalHero.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    }

    // 6. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1, // Lower threshold to ensure trigger on smaller screens
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        observer.observe(el);

        // Immediate check for elements already in view
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
        }
    });

    // 7. Contact Modal Trigger (Replaces Scroll for Contact links)
    document.querySelectorAll('a[href$="#contact"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
                modalShown = true;
            } else {
                // Fallback if modal isn't present for some reason
                window.location.href = 'index.html#contact';
            }
        });
    });

    // 8. Smooth scroll for OTHER nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Skip contact links as they are handled above
            if (targetId.endsWith('#contact')) return;

            if (targetId === '#facility-modal' && !this.id.includes('hero')) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Form submission handled by firebase-integration.js

    // 9. Interactive Effects (Glow)
    document.addEventListener('mousemove', (e) => {
        const glows = document.querySelectorAll('.hero-glow');
        if (glows.length > 0) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            glows.forEach((glow, index) => {
                const speed = (index + 1) * 30;
                const moveX = (x * speed);
                const moveY = (y * speed);
                glow.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }
    });
});
