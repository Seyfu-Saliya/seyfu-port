// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initializeAnimations();
    
    // Add scroll animations
    initializeScrollAnimations();
    
    // Add parallax effect
    initializeParallaxEffect();
    
    // Add typing effect
    initializeTypingEffect();
    
    // Add skill progress
    initializeSkillProgress();

    // Add download buttons
    initializeDownloadButtons();

    // Add print functionality
    initializePrintButton();

    // Add header animations
    initializeHeaderAnimations();

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
    };

    // Intersection Observer for skill bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe skills section
    const skillsSection = document.querySelector('.skills-chart');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Add hover effect to experience and education items
    const items = document.querySelectorAll('.experience-item, .education-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // PDF viewer enhancement
    const pdfEmbed = document.querySelector('.cv-pdf-embed iframe');
    if (pdfEmbed) {
        pdfEmbed.addEventListener('load', () => {
            pdfEmbed.style.opacity = '1';
        });
    }
});

function initializeAnimations() {
    // Animate sections on load
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('animate');
        }, index * 200);
    });

    // Add hover effects to profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseover', () => {
            profileImage.style.transform = 'scale(1.05) rotate(2deg)';
        });
        profileImage.addEventListener('mouseout', () => {
            profileImage.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Add hover effects to download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateY(-2px)';
            }
        });
        btn.addEventListener('mouseout', () => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateY(0)';
            }
        });
    });

    // Add hover effects to experience and education items
    const items = document.querySelectorAll('.experience-item, .education-item');
    items.forEach(item => {
        item.addEventListener('mouseover', () => {
            const icon = item.querySelector('h3 i');
            if (icon) {
                icon.style.transform = 'rotate(15deg)';
            }
        });
        item.addEventListener('mouseout', () => {
            const icon = item.querySelector('h3 i');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillProgress(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('section, .skill-item').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeParallaxEffect() {
    const header = document.querySelector('.cv-header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            header.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }
}

function initializeTypingEffect() {
    const title = document.querySelector('.profile-info .title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    }
}

function initializeSkillProgress() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-bar-fill');
        if (progressBar) {
            const percentage = progressBar.getAttribute('data-progress');
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, 200);
        }
    });
}

function animateSkillProgress(skillItem) {
    const progressBar = skillItem.querySelector('.skill-bar-fill');
    if (progressBar) {
        const percentage = progressBar.getAttribute('data-progress');
        progressBar.style.width = percentage + '%';
    }
}

function initializeDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(btn => {
        // Add click animation
        btn.addEventListener('click', async (e) => {
            if (btn.classList.contains('print-btn')) return;
            
            e.preventDefault();
            const originalText = btn.innerHTML;
            const icon = btn.querySelector('i');
            
            // Add loading state
            btn.classList.add('loading');
            icon.style.animation = 'spin 1s linear infinite';
            
            try {
                // Simulate download delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Add success state
                btn.classList.remove('loading');
                btn.classList.add('success');
                icon.style.animation = '';
                icon.className = 'fas fa-check';
                
                // Trigger actual download
                const href = btn.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    btn.classList.remove('success');
                    btn.innerHTML = originalText;
                }, 2000);
            } catch (error) {
                // Handle error state
                btn.classList.remove('loading');
                btn.classList.add('error');
                icon.className = 'fas fa-exclamation-circle';
                
                setTimeout(() => {
                    btn.classList.remove('error');
                    btn.innerHTML = originalText;
                }, 2000);
            }
        });

        // Add hover effects
        btn.addEventListener('mouseover', () => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateY(-2px) scale(1.1)';
            }
        });

        btn.addEventListener('mouseout', () => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

function initializePrintButton() {
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Add loading state
            printBtn.classList.add('loading');
            const icon = printBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';

            // Prepare the document for printing
            const originalStyles = document.body.style.cssText;
            document.body.style.background = 'white';
            document.body.style.color = 'black';

            // Hide elements that shouldn't be printed
            const elementsToHide = document.querySelectorAll('.navbar, .preloader, .theme-toggle, .download-buttons, footer');
            elementsToHide.forEach(el => {
                el.style.display = 'none';
            });

            // Add print-specific class
            document.body.classList.add('printing');

            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>CV - Seyfu Saliya</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: black;
                                background: white;
                                margin: 0;
                                padding: 20px;
                            }
                            .cv-container {
                                max-width: 100%;
                                margin: 0 auto;
                            }
                            .cv-header {
                                background: none;
                                color: black;
                                padding: 0;
                                margin-bottom: 2rem;
                            }
                            .profile-section {
                                display: flex;
                                gap: 2rem;
                                margin-bottom: 2rem;
                            }
                            .profile-image {
                                width: 150px;
                                height: 150px;
                                border: 2px solid black;
                            }
                            .profile-image img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                            .profile-info h1 {
                                color: black;
                                font-size: 2rem;
                                margin-bottom: 0.5rem;
                            }
                            .profile-info .title {
                                font-size: 1.2rem;
                                margin-bottom: 1rem;
                            }
                            .contact-info {
                                margin-bottom: 1rem;
                            }
                            section {
                                margin-bottom: 2rem;
                                page-break-inside: avoid;
                            }
                            h2 {
                                color: black;
                                border-bottom: 2px solid black;
                                padding-bottom: 0.5rem;
                                margin-bottom: 1rem;
                            }
                            .experience-item, .education-item {
                                margin-bottom: 1.5rem;
                            }
                            .skills-grid {
                                display: grid;
                                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                                gap: 1rem;
                            }
                            @media print {
                                body {
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${document.querySelector('.cv-container').outerHTML}
                    </body>
                </html>
            `);

            // Wait for the content to load
            printWindow.document.close();
            printWindow.onload = function() {
                // Print the window
                printWindow.print();
                
                // Close the window after printing
                printWindow.onafterprint = function() {
                    printWindow.close();
                    
                    // Reset the original state
                    document.body.style.cssText = originalStyles;
                    elementsToHide.forEach(el => {
                        el.style.display = '';
                    });
                    document.body.classList.remove('printing');
                    
                    // Reset button state
                    printBtn.classList.remove('loading');
                    icon.style.animation = '';
                };
            };
        });

        // Add hover effect
        printBtn.addEventListener('mouseover', () => {
            const icon = printBtn.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateY(-2px) scale(1.1)';
            }
        });

        printBtn.addEventListener('mouseout', () => {
            const icon = printBtn.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateY(0) scale(1)';
            }
        });
    }
}

function initializeHeaderAnimations() {
    const header = document.querySelector('.cv-header');
    const profileImage = document.querySelector('.profile-image');
    const profileInfo = document.querySelector('.profile-info');
    const contactInfo = document.querySelector('.contact-info');
    const downloadButtons = document.querySelector('.download-buttons');

    // Enhanced parallax effect for header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.1}px)`;
            header.style.backgroundPosition = `${scrolled * 0.05}px ${scrolled * 0.05}px`;
            
            // Add tilt effect based on mouse position
            const mouseX = (window.innerWidth / 2 - window.mouseX) * 0.01;
            const mouseY = (window.innerHeight / 2 - window.mouseY) * 0.01;
            header.style.transform += ` rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
        }
    });

    // Track mouse position for tilt effect
    window.addEventListener('mousemove', (e) => {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });

    // Enhanced profile image effects
    if (profileImage) {
        // Hover effect with 3D rotation
        profileImage.addEventListener('mouseover', () => {
            profileImage.style.transform = 'scale(1.05) rotate3d(1, 1, 1, 15deg)';
            profileImage.style.boxShadow = '0 15px 30px rgba(56, 189, 248, 0.3)';
            
            // Add glow effect
            profileImage.style.filter = 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))';
        });

        profileImage.addEventListener('mouseout', () => {
            profileImage.style.transform = 'scale(1) rotate3d(0, 0, 0, 0deg)';
            profileImage.style.boxShadow = '0 10px 20px rgba(56, 189, 248, 0.2)';
            profileImage.style.filter = 'none';
        });

        // Enhanced click effect with ripple
        profileImage.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            profileImage.appendChild(ripple);

            const rect = profileImage.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;

            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Enhanced profile info animations
    if (profileInfo) {
        const name = profileInfo.querySelector('h1');
        const title = profileInfo.querySelector('.title');
        
        if (name) {
            // Split name into letters for individual animation
            const letters = name.textContent.split('');
            name.textContent = '';
            letters.forEach((letter, i) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.opacity = '0';
                span.style.transform = 'translateY(-20px)';
                span.style.display = 'inline-block';
                name.appendChild(span);

                setTimeout(() => {
                    span.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 200 + (i * 50));
            });
        }

        if (title) {
            // Enhanced typing effect with cursor
            const text = title.textContent;
            title.textContent = '';
            title.innerHTML = '<span class="typing-cursor"></span>';
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.insertBefore(document.createTextNode(text.charAt(i)), title.firstChild);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    title.querySelector('.typing-cursor').style.display = 'none';
                }
            };
            setTimeout(typeWriter, 800);
        }
    }

    // Enhanced contact info animations
    if (contactInfo) {
        const items = contactInfo.querySelectorAll('p');
        items.forEach((item, index) => {
            // Add wave animation to each item
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            // Add hover effect
            item.addEventListener('mouseover', () => {
                item.style.transform = 'translateX(10px) scale(1.05)';
                item.style.color = '#38bdf8';
            });
            
            item.addEventListener('mouseout', () => {
                item.style.transform = 'translateX(0) scale(1)';
                item.style.color = '';
            });

            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 600 + (index * 100));
        });
    }

    // Enhanced contact icons
    const contactIcons = document.querySelectorAll('.contact-info i');
    contactIcons.forEach(icon => {
        // Add pulse animation on hover
        icon.addEventListener('mouseover', () => {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.color = '#38bdf8';
            icon.style.animation = 'pulse 1s infinite';
        });

        icon.addEventListener('mouseout', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
            icon.style.animation = 'none';
        });
    });

    // Add particle effect to header
    createParticles(header);
}

// Add particle effect
function createParticles(container) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);

        // Random position and size
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation
        particle.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
    }
}

// Add dynamic styles for enhanced animations
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .cv-header {
        transition: transform 0.3s ease, background-position 0.3s ease;
        transform-style: preserve-3d;
        perspective: 1000px;
    }

    .profile-image {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(56, 189, 248, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    .typing-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background: #38bdf8;
        margin-left: 2px;
        animation: blink 1s infinite;
    }

    .particle {
        position: absolute;
        background: rgba(56, 189, 248, 0.3);
        border-radius: 50%;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes blink {
        50% { opacity: 0; }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-20px) translateX(10px); }
    }

    .profile-image:hover {
        animation: float 3s ease-in-out infinite;
    }

    .contact-info p {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .contact-info i {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(enhancedStyles);

// Add dynamic styles for animations
const style = document.createElement('style');
style.textContent = `
    .scroll-animate {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .scroll-animate.animate {
        opacity: 1;
        transform: translateY(0);
    }
    .printing * {
        animation: none !important;
        transition: none !important;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Add dynamic styles for header animations
const headerStyles = document.createElement('style');
headerStyles.textContent = `
    .cv-header {
        transition: transform 0.3s ease, background-position 0.3s ease;
    }

    .profile-image {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .profile-info h1,
    .profile-info .title {
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .contact-info p {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .contact-info i {
        transition: all 0.3s ease;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .profile-image:hover {
        animation: float 3s ease-in-out infinite;
    }
`;
document.head.appendChild(headerStyles);

// Add print-specific styles
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .no-print {
            display: none !important;
        }
        
        body {
            background: white !important;
            color: black !important;
        }
        
        .cv-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
        }
        
        .cv-header {
            background: none !important;
            color: black !important;
            padding: 0 !important;
            margin-bottom: 2rem !important;
            box-shadow: none !important;
        }
        
        .profile-image {
            border: 2px solid #000 !important;
        }
        
        section {
            break-inside: avoid;
            page-break-inside: avoid;
            background: none !important;
            box-shadow: none !important;
            margin-bottom: 2rem !important;
            padding: 0 !important;
        }
        
        section::before {
            display: none !important;
        }
        
        .experience-item,
        .education-item,
        .skill-item {
            background: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin-bottom: 1.5rem !important;
        }
        
        a {
            color: black !important;
            text-decoration: none !important;
        }
        
        h1, h2, h3 {
            color: black !important;
        }
        
        .profile-section {
            gap: 2rem !important;
        }
        
        .contact-info i {
            color: black !important;
        }
        
        .printing * {
            animation: none !important;
            transition: none !important;
        }
    }
`;
document.head.appendChild(printStyles); 