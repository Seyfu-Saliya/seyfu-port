document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.tech-card, .project-card, .hero-content, .about-content').forEach((el) => {
        observer.observe(el);
    });

    // --- Animated Headline Typewriter Effect ---
    const headline = document.querySelector('.animated-headline');
    if (headline) {
        const greeting = headline.querySelector('.greeting');
        const name = headline.querySelector('.name');
        const title = headline.querySelector('.title');
        if (name && title) {
            name.textContent = '';
            title.textContent = '';
            const nameText = 'Seyfu Saliya';
            const titleText = 'Web & Mobile Developer';
            let i = 0, j = 0;
            function typeName() {
                if (i < nameText.length) {
                    name.textContent += nameText.charAt(i);
                    i++;
                    setTimeout(typeName, 80);
                } else {
                    setTimeout(typeTitle, 400);
                }
            }
            function typeTitle() {
                if (j < titleText.length) {
                    title.textContent += titleText.charAt(j);
                    j++;
                    setTimeout(typeTitle, 60);
                }
            }
            setTimeout(typeName, 400);
        }
    }

    // --- Modern Navbar Interactivity ---
    const navbar = document.querySelector('.navbar');
    //const navToggle = document.querySelector('.nav-toggle');
    //const navLinks = document.querySelector('.nav-links');
    const navLinksList = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;

    // Sticky shadow and background transition on scroll
    function handleNavbarScroll() {
        if (window.scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // Hamburger menu open/close
    navToggle.addEventListener('click', function() {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
            navLinks.querySelector('.nav-link').focus();
        }
    });

    // Close mobile nav on link click
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Keyboard accessibility for hamburger
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });

    // Highlight active link
    function setActiveNavLink() {
        const path = window.location.pathname.split('/').pop();
        navLinksList.forEach(link => {
            const href = link.getAttribute('href');
            if ((path === '' && href === 'index.html') || path === href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveNavLink();

    // Animate skill bars on the CV page when they scroll into view
    (function() {
        if (document.querySelector('.cv-skills')) {
            const skillSections = document.querySelectorAll('.cv-skill');
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target.querySelector('.cv-skill-level');
                        if (bar && !entry.target.classList.contains('animated')) {
                            const width = bar.getAttribute('style').match(/width:\s*([0-9]+%)/);
                            bar.style.width = '0';
                            setTimeout(() => {
                                bar.style.width = width ? width[1] : '80%';
                            }, 100);
                            entry.target.classList.add('animated');
                        }
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            skillSections.forEach(skill => observer.observe(skill));
        }
    })();

    // Animate CV/Resume/Print buttons on page load and hover
    (function() {
        const btns = document.querySelectorAll('.cv-download-group .cv-btn');
        btns.forEach((btn, i) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(30px)';
            setTimeout(() => {
                btn.style.transition = 'opacity 0.7s cubic-bezier(.4,2,.6,1), transform 0.7s cubic-bezier(.4,2,.6,1)';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 400 + i * 180);

            // Pulse effect on hover
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('pulse-anim');
            });
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('pulse-anim');
            });
        });
    })();
}); 