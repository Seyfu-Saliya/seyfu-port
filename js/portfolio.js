// Portfolio Page Functionality for Seyfu Saliya
// Handles filtering, sorting, scroll animations, scroll-to-top, and lazy loading

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioFilters();
    initPortfolioSort();
    initScrollAnimations();
    initScrollTopButton();
    initLazyLoading();
    const dynamicProjects = document.getElementById('dynamic-projects');
    if (dynamicProjects && loadedProjects === 0) {
        const nextProjects = additionalProjects.slice(loadedProjects, loadedProjects + PROJECTS_PER_LOAD);
        renderProjects(nextProjects);
        loadedProjects += nextProjects.length;
    }
});

// --- Filtering ---
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 10);
                } else {
                    card.classList.remove('animate');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// --- Sorting ---
function initPortfolioSort() {
    const sortSelect = document.querySelector('.sort-select');
    const projectsGrid = document.querySelector('.projects-grid');
    const dynamicProjects = document.getElementById('dynamic-projects');
    if (!sortSelect || !projectsGrid) return;

    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        const cards = [
            ...Array.from(projectsGrid.children),
            ...Array.from(dynamicProjects ? dynamicProjects.children : [])
        ];
        let sorted;
        if (sortBy === 'name') {
            sorted = cards.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
        } else if (sortBy === 'recent') {
            sorted = cards.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
        } else if (sortBy === 'popular') {
            sorted = cards.sort((a, b) => (parseInt(b.dataset.views) || 0) - (parseInt(a.dataset.views) || 0));
        }
        sorted.forEach(card => {
            if (projectsGrid.contains(card)) {
                projectsGrid.appendChild(card);
            } else if (dynamicProjects) {
                dynamicProjects.appendChild(card);
            }
        });
    });
}

// --- Scroll Animations ---
function initScrollAnimations() {
    const cards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
}

// --- Scroll to Top Button ---
function initScrollTopButton() {
    const scrollBtn = document.querySelector('.scroll-top');
    if (!scrollBtn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Lazy Loading Images ---
function initLazyLoading() {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        lazyImgs.forEach(img => imgObserver.observe(img));
    } else {
        lazyImgs.forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
        });
    }
}

// --- Additional Projects for Load More (JS Array) ---
const additionalProjects = [
  {
    title: 'Mobile HealthCare',
    desc: 'A scalable and secure backend system designed for healthcare platforms, featuring user authentication, patient record management, appointment scheduling, and medical staff coordination.',
    tags: ['Javascript', 'PHP', 'MySQL'],
    category: 'web development',
    date: '2024-04-20',
    views: 1600,
    img: 'assets/mobile-healthcare-web-design-in-flat-style-vector-47979531.jpg',
    live: '404.html',
    source: 'https://github.com/Seyfu-Saliya/hospital-mgt-system',
    alt: 'Mobile HealthCare'
  },
  {
    title: 'Face Detector AI',
    desc: 'A Face Detector AI, Creating a face detector AI in MATLAB typically involves using pre-trained models, such as the ones in the Computer Vision Toolbox, to detect faces in images or video frames.',
    tags: ['MATLAB', 'Computer Vision Toolbox', 'Image Processing Toolbox'],
    category: 'backend',
    date: '2024-03-10',
    views: 1400,
    img: 'assets/OIP.jpg',
    live: '404.html',
    source: 'https://github.com/Seyfu-Saliya/Face-detector',
    alt: 'Face Detector AI'
  },
  {
    title: 'Health Tracker Mobile',
    desc: 'A mobile app for tracking daily health metrics, habits, and providing personalized recommendations.',
    tags: ['Flutter', 'Dart', 'SQLite'],
    category: 'mobile',
    date: '2024-02-28',
    views: 1200,
    img: 'assets/healthtrack-free-figma-mobile-ui-kit-cover-1024x768.webp',
    live: '404.html',
    source: '#',
    alt: 'Health Tracker Mobile'
  },
  {
    title: 'Real-Time Chat Service',
    desc: 'A backend service for real-time messaging with group chat, notifications, and media support.',
    tags: ['Node.js', 'Socket.io', 'Redis'],
    category: 'backend',
    date: '2024-01-15',
    views: 1350,
    img: 'assets/Live-Chat-Support-1024x1024.jpg',
    live: '#',
    source: '#',
    alt: 'Real-Time Chat Service'
  }
];
let loadedProjects = 0;
const PROJECTS_PER_LOAD = 2;

// Helper function to render projects
function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    projects.forEach(proj => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.category = proj.category;
        card.dataset.date = proj.date;
        card.dataset.views = proj.views;
        card.innerHTML = `
            <div class="project-image">
                <img src="${proj.img}" alt="${proj.alt}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        <a href="${proj.live}" class="project-link" aria-label="View live demo">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            Live Demo
                        </a>
                        <a href="${proj.source}" class="project-link" aria-label="View source code">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            Source Code
                        </a>
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
                <div class="project-tags">
                    ${proj.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;
        card.style.opacity = 0;
        projectsGrid.appendChild(card);
        setTimeout(() => {
            card.classList.add('animate');
            card.style.opacity = 1;
        }, 50);
    });
    initScrollAnimations();
    initLazyLoading();
}

const loadMoreBtn = document.querySelector('.load-more');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.innerHTML = '<span class="spinner"></span> Loading...';
        loadMoreBtn.disabled = true;
        setTimeout(() => {
            const nextProjects = additionalProjects.slice(loadedProjects, loadedProjects + PROJECTS_PER_LOAD);
            renderProjects(nextProjects);
            loadedProjects += nextProjects.length;
            if (loadedProjects >= additionalProjects.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.textContent = 'Load More Projects';
                loadMoreBtn.disabled = false;
            }
        }, 700);
    });
} 