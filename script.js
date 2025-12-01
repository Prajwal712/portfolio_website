document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in-section'); // Add initial class for CSS to handle
        observer.observe(section);
    });

    // Add CSS for animation dynamically or ensure it's in style.css
    // Here we'll add a simple class to style.css logic via JS if needed, 
    // but better to have it in CSS. Let's assume we might want to add some specific styles here if they weren't in CSS.
    // For now, the 'animate' class will trigger transitions if we add them to CSS.
    // Let's add the animation styles to the document head to ensure they exist.
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-section.animate {
            opacity: 1;
            transform: translateY(0);
        }
        .hamburger.toggle .bar:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .hamburger.toggle .bar:nth-child(2) {
            opacity: 0;
        }
        .hamburger.toggle .bar:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');

    // Initial position to center or hide
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            cursorGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });
    });

    // Falling Stars / Comets Background Animation
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let stars = [];
        const numberOfStars = 50;

        class Star {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                // Start from top or right side
                if (initial) {
                    this.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.2;
                    this.y = Math.random() * canvas.height * 1.5 - canvas.height * 0.5;
                } else {
                    // Spawn outside top-right area
                    if (Math.random() > 0.5) {
                        // Spawn top
                        this.x = Math.random() * canvas.width * 1.5;
                        this.y = -100;
                    } else {
                        // Spawn right
                        this.x = canvas.width + 100;
                        this.y = Math.random() * canvas.height;
                    }
                }

                this.size = Math.random() * 2 + 0.5;
                this.speed = Math.random() * 1.5 + 0.5;
                this.length = Math.random() * 80 + 10;
                this.color = Math.random() > 0.5 ? '#00d4ff' : '#7a28ff';
            }

            draw() {
                // Create gradient for the tail
                // Tail goes up-right from the head (x,y)
                const tailX = this.x + this.length;
                const tailY = this.y - this.length;

                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, this.color); // Head
                gradient.addColorStop(1, 'transparent'); // Tail end

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();
            }

            update() {
                // Move diagonal bottom-left
                this.x -= this.speed;
                this.y += this.speed;

                // Reset if out of bounds (far left or far bottom)
                if (this.x < -this.length * 2 || this.y > canvas.height + this.length * 2) {
                    this.reset();
                }

                this.draw();
            }
        }

        function init() {
            stars = [];
            for (let i = 0; i < numberOfStars; i++) {
                stars.push(new Star());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => star.update());
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }

    // Phone Number Copy Functionality
    const phoneContact = document.getElementById('phone-contact');
    if (phoneContact) {
        phoneContact.addEventListener('click', () => {
            const phoneNumber = phoneContact.getAttribute('data-number');
            navigator.clipboard.writeText(phoneNumber).then(() => {
                // Visual feedback
                const originalText = phoneContact.querySelector('p').innerText;
                phoneContact.querySelector('p').innerText = 'Copied!';
                setTimeout(() => {
                    phoneContact.querySelector('p').innerText = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});
