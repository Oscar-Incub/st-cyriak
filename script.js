// Современный JavaScript с передовыми технологиями
class ModernWebsite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupCursor();
        this.setupNavigation();
        this.setupCounters();
        this.setupWorkShowcase();
        this.setupFormHandling();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.animateOnScroll();
            this.setupParallax();
        });
    }

    setupEventListeners() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    setupCursor() {
        const cursor = document.querySelector('.cursor-follower');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let isScaled = false;

        const setCursorTransform = () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)${isScaled ? ' scale(2)' : ''}`;
        };

        const updateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            setCursorTransform();
            requestAnimationFrame(updateCursor);
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const interactiveElements = document.querySelectorAll('a, button, .service-card, .work-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isScaled = true;
                setCursorTransform();
                cursor.style.mixBlendMode = 'difference';
            });
            el.addEventListener('mouseleave', () => {
                isScaled = false;
                setCursorTransform();
                cursor.style.mixBlendMode = 'difference';
            });
        });

        updateCursor();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 100;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', this.throttle(updateActiveNav, 100));
    }

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    const children = entry.target.querySelectorAll('.service-card, .feature-item, .contact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('fade-in-up');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.about-content, .services-grid, .work-showcase, .contact-content');
        animatedElements.forEach(el => observer.observe(el));
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    setupWorkShowcase() {
        const workItems = document.querySelectorAll('.work-item');
        const navDots = document.querySelectorAll('.nav-dot');
        let currentIndex = 0;
        let autoplayInterval;

        const showProject = (index) => {
            workItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            navDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const nextProject = () => {
            currentIndex = (currentIndex + 1) % workItems.length;
            showProject(currentIndex);
        };

        const startAutoplay = () => {
            autoplayInterval = setInterval(nextProject, 5000);
        };

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showProject(currentIndex);
                stopAutoplay();
                setTimeout(startAutoplay, 3000);
            });
        });

        const showcase = document.querySelector('.work-showcase');
        if (showcase) {
            showcase.addEventListener('mouseenter', stopAutoplay);
            showcase.addEventListener('mouseleave', startAutoplay);
        }

        startAutoplay();
    }

    setupFormHandling() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const formFields = form.querySelectorAll('.form-field input, .form-field textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });
            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentElement.classList.remove('focused');
                }
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.95)';
            await this.simulateFormSubmission();
            btnText.textContent = 'Gesendet! ✓';
            submitBtn.style.background = 'var(--primary)';
            submitBtn.style.color = 'var(--bg-dark)';
            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.transform = '';
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                form.reset();
                formFields.forEach(field => {
                    field.parentElement.classList.remove('focused');
                });
            }, 3000);
        });
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.neural-network, .floating-particles');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const nav = document.querySelector('.nav-container');
        if (scrolled > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
            nav.style.backdropFilter = 'blur(20px)';
        }
        // Параллакс для hero элементов
        const heroElements = document.querySelectorAll('.hologram-ring');
        heroElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    handleResize() {
        this.setupParallax();
        // Matrix rain canvas resize
        const canvas = document.querySelector('canvas.matrix-rain');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .feature-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('fade-in-up');
                }
            });
        });
        elements.forEach(el => observer.observe(el));
    }

    async simulateFormSubmission() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Дополнительные эффекты и утилиты
class AdvancedEffects {
    constructor() {
        //this.setupGlitchEffect();
        this.setupMatrixRain();
        this.setupAudioVisualization();
    }

   /* setupGlitchEffect() {
        const titles = document.querySelectorAll('.hero-title, .section-title');
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                this.applyGlitch(title);
            });
        });
    }*/
/*
    applyGlitch(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        const glitchInterval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            if (iterations >= originalText.length) {
                clearInterval(glitchInterval);
                element.textContent = originalText;
            }
            iterations += 1/3;
        }, 30);
    }*/

    setupMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.classList.add('matrix-rain');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        const fontSize = 10;
        let columns = Math.floor(canvas.width / fontSize);
        let drops = [];
        function resetDrops() {
            columns = Math.floor(canvas.width / fontSize);
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
        }
        resetDrops();
        window.addEventListener('resize', resetDrops);

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff88';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        setInterval(draw, 35);
    }

    setupAudioVisualization() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            // Реализация аудио-визуализации
            console.log('Audio visualization ready');
        }
    }
}

// Инициализация
const website = new ModernWebsite();
const effects = new AdvancedEffects();

// Дополнительные современные функции
class FuturisticFeatures {
    constructor() {
        this.setupVoiceCommands();
        this.setupGestureControls();
        this.setupAIChat();
    }

    setupVoiceCommands() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'de-DE';
            document.addEventListener('keydown', (e) => {
                if (e.key === 'v' && e.ctrlKey) {
                    recognition.start();
                }
            });
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };
        }
    }

    processVoiceCommand(command) {
        const commands = {
            'startseite': '#home',
            'über uns': '#about',
            'leistungen': '#services',
            'arbeiten': '#work',
            'kontakt': '#contact'
        };
        Object.keys(commands).forEach(key => {
            if (command.includes(key)) {
                document.querySelector(`a[href="${commands[key]}"]`).click();
            }
        });
    }

    setupGestureControls() {
        let startY = 0;
        let startX = 0;
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const diffY = startY - endY;
            const diffX = startX - endX;
            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {
                this.navigateToNextSection();
            }
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {
                this.navigateToPrevSection();
            }
        });
    }

    navigateToNextSection() {
        const sections = document.querySelectorAll('section');
        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(sections).indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    navigateToPrevSection() {
        const sections = document.querySelectorAll('section');
        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(sections).indexOf(currentSection);
        if (currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + window.innerHeight / 2;
        for (let section of sections) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                return section;
            }
        }
        return sections[0];
    }

    setupAIChat() {
        const chatButton = document.createElement('div');
        chatButton.innerHTML = '🤖';
        chatButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
            transition: transform 0.3s ease;
        `;
        chatButton.addEventListener('mouseenter', () => {
            chatButton.style.transform = 'scale(1.1)';
        });
        chatButton.addEventListener('mouseleave', () => {
            chatButton.style.transform = 'scale(1)';
        });
        chatButton.addEventListener('click', () => {
            alert('AI Chat wird bald verfügbar sein! 🚀');
        });
        document.body.appendChild(chatButton);
    }
}

const futuristicFeatures = new FuturisticFeatures();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernWebsite, AdvancedEffects, FuturisticFeatures };
}
