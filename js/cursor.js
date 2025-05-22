document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let cursorVisible = true;
    let cursorEnlarged = false;

    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        
        // Add delay to cursor outline
        setTimeout(() => {
            cursorOutline.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        }, 100);

        // Show cursor
        if (!cursorVisible) {
            cursorDot.style.opacity = 1;
            cursorOutline.style.opacity = 1;
            cursorVisible = true;
        }
    });

    // Mouse leave event
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorOutline.style.opacity = 0;
        cursorVisible = false;
    });

    // Mouse enter event
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
        cursorVisible = true;
    });

    // Click event
    document.addEventListener('mousedown', () => {
        cursorDot.style.transform += ' scale(0.5)';
        cursorOutline.style.transform += ' scale(1.5)';
        cursorEnlarged = true;
    });

    document.addEventListener('mouseup', () => {
        cursorDot.style.transform = cursorDot.style.transform.replace(' scale(0.5)', '');
        cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
        cursorEnlarged = false;
    });

    // Hover effect for interactive elements
    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorOutline.style.transform += ' scale(1.5)';
            cursorEnlarged = true;
        });

        link.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
            cursorEnlarged = false;
        });
    });

    // Hide cursor when not moving
    let cursorTimeout;
    document.addEventListener('mousemove', () => {
        clearTimeout(cursorTimeout);
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;

        cursorTimeout = setTimeout(() => {
            if (!cursorEnlarged) {
                cursorDot.style.opacity = 0;
                cursorOutline.style.opacity = 0;
            }
        }, 1000);
    });
}); 