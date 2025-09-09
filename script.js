// ================================
// VIBEWORKS AI STUDIO - PREMIUM INTERACTIONS
// Multi-Million Dollar Quality JavaScript
// ================================

class VibeWorksStudio {
    constructor() {
        this.init();
    }

    init() {
        this.initializeLoadingState();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupIntersectionObserver();
        this.setupParallax();
        this.setupForms();
        this.setupMicroInteractions();
        this.setupPerformanceOptimizations();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    initializeLoadingState() {
        // Setup premium loading sequence with the new HTML loading screen
        this.setupPremiumLoading();
    }

    setupPremiumLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressFill = document.querySelector('.progress-fill');
        const loadingPercentage = document.querySelector('.loading-percentage');
        
        if (!loadingScreen || !progressFill || !loadingPercentage) {
            // If loading screen elements don't exist, skip to main initialization
            setTimeout(() => this.onReady(), 100);
            return;
        }

        let progress = 0;
        const duration = 3500; // 3.5 seconds for premium feel
        const interval = 50; // Smooth updates
        const baseIncrement = (interval / duration) * 100;

        const updateProgress = () => {
            // Add organic variation to the progress
            const variation = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
            progress += baseIncrement * variation;
            
            // Slow down as we approach 100%
            if (progress > 90) {
                progress += (100 - progress) * 0.1;
            }
            
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            loadingPercentage.textContent = `${Math.floor(progress)}%`;
            
            if (progress >= 100) {
                setTimeout(() => {
                    this.completeLoading(loadingScreen);
                }, 800); // Hold at 100% briefly
            } else {
                requestAnimationFrame(() => {
                    setTimeout(updateProgress, interval);
                });
            }
        };

        // Start progress animation after logo entrance
        setTimeout(updateProgress, 1000);
    }

    completeLoading(loadingScreen) {
        // Add completion class for final animation
        loadingScreen.classList.add('fade-out');
        
        // Initialize main experience after loading completes
        setTimeout(() => {
            this.onReady();
            this.setupEntranceAnimations();
            
            // Remove loading screen from DOM
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 100);
        }, 700);
    }

    setupEntranceAnimations() {
        // Sophisticated staggered entrance animations
        const entranceElements = [
            { selector: '.navbar', delay: 0 },
            { selector: '.hero-content > *', delay: 200 },
            { selector: '.hero-visual', delay: 400 }
        ];

        entranceElements.forEach(({ selector, delay }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (element) {
                    // Set initial state
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(40px)';
                    
                    setTimeout(() => {
                        element.style.transition = 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, delay + (index * 100));
                }
            });
        });
    }

    onReady() {
        // Initialize mobile-specific features
        this.setupMobileVentureCards();
        this.setupMobileTouchFeedback();
        this.setupMobilePerformanceOptimizations();
        this.setupMobileEnhancements();
        
        // Optimize loading time for mobile
        const isMobile = window.innerWidth <= 768;
        const loadingTime = isMobile ? 1500 : 2000; // Faster loading on mobile
        
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startMainAnimations();
        }, loadingTime);
    }

    setupMobilePerformanceOptimizations() {
        // Throttle scroll events on mobile for better performance
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        if (window.innerWidth <= 768) {
            window.addEventListener('scroll', () => {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollTimeout = setTimeout(() => {
                    // Execute scroll handlers
                    if (originalScrollHandler) {
                        originalScrollHandler();
                    }
                }, 16); // ~60fps
            }, { passive: true });
        }

        // Optimize touch events
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
    }

    setupMobileEnhancements() {
        if (window.innerWidth <= 768) {
            this.setupPullToRefresh();
            this.setupSwipeNavigation();
            this.setupMobileScrollIndicator();
        }
    }

    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        const threshold = 80;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;
                
                if (pullDistance > 0 && pullDistance < threshold) {
                    // Visual feedback for pull-to-refresh
                    document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
                    document.body.style.transition = 'transform 0.1s ease-out';
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (pullDistance > threshold) {
                // Trigger refresh
                this.addHapticFeedback();
                window.location.reload();
            } else {
                // Reset position
                document.body.style.transform = '';
                document.body.style.transition = 'transform 0.3s ease-out';
            }
            startY = 0;
            pullDistance = 0;
        });
    }

    setupSwipeNavigation() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = 0;
        
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            const swipeDistance = touchStartY - touchEndY;
            const minSwipeDistance = 50;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0 && currentSection < sections.length - 1) {
                    // Swipe up - next section
                    currentSection++;
                    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
                    this.addHapticFeedback();
                } else if (swipeDistance < 0 && currentSection > 0) {
                    // Swipe down - previous section
                    currentSection--;
                    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
                    this.addHapticFeedback();
                }
            }
        });
    }

    setupMobileScrollIndicator() {
        // Add a visual scroll indicator for mobile
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'mobile-scroll-indicator';
        scrollIndicator.innerHTML = `
            <div class="scroll-dot active"></div>
            <div class="scroll-dot"></div>
            <div class="scroll-dot"></div>
            <div class="scroll-dot"></div>
            <div class="scroll-dot"></div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-scroll-indicator {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .scroll-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: all 0.3s ease;
            }
            
            .scroll-dot.active {
                background: rgba(99, 102, 241, 0.8);
                transform: scale(1.2);
            }
            
            @media (min-width: 769px) {
                .mobile-scroll-indicator {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(scrollIndicator);
        
        // Update dots on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const dots = scrollIndicator.querySelectorAll('.scroll-dot');
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const dot = dots[index];
                
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    dots.forEach(d => d.classList.remove('active'));
                    if (dot) dot.classList.add('active');
                }
            });
        });
    }

    setupMobileVentureCards() {
        const ventureCards = document.querySelectorAll('.venture-card');
        
        ventureCards.forEach(card => {
            // Touch events for mobile overlay activation
            card.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent default touch behavior
                
                // Remove active class from all other cards
                ventureCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                
                // Toggle active class on touched card
                card.classList.toggle('active');
                
                // Add haptic feedback
                this.addHapticFeedback();
            }, { passive: false });

            // Handle touch end to allow navigation
            card.addEventListener('touchend', (e) => {
                const overlay = card.querySelector('.venture-overlay');
                const overlayLink = overlay?.querySelector('.venture-overlay-link');
                
                if (card.classList.contains('active') && overlayLink) {
                    // If card is active and we have overlay link, navigate after a delay
                    setTimeout(() => {
                        // Uncomment the line below when ready to add navigation
                        // window.location.href = overlayLink.href;
                    }, 200);
                }
            });

            // Close overlay when touching outside
            document.addEventListener('touchstart', (e) => {
                if (!card.contains(e.target)) {
                    card.classList.remove('active');
                }
            });
        });
    }

    setupMobileTouchFeedback() {
        // Add touch feedback to all interactive elements
        const interactiveElements = document.querySelectorAll('button, .btn, .nav-link, .venture-link, .nav-toggle');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
                element.style.transition = 'transform 0.1s ease-out';
                this.addHapticFeedback();
            }, { passive: true });

            element.addEventListener('touchend', () => {
                element.style.transform = '';
                element.style.transition = 'transform 0.2s ease-out';
            }, { passive: true });
        });
    }

    hideLoadingScreen() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 500);
        }
        document.documentElement.classList.remove('loading');
    }

    startMainAnimations() {
        // Animate hero elements
        this.animateHeroEntrance();
        
        // Start background animations
        this.startBackgroundAnimations();
        
        // Initialize scroll progress
        this.updateScrollProgress();
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navProgress = document.querySelector('.nav-progress');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navbar) return;

        // Enhanced mobile navigation toggle with premium animations
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                this.animateHamburger(navToggle);
                
                // Prevent body scroll when mobile menu is open
                document.body.style.overflow = navToggle.classList.contains('active') ? 'hidden' : '';
                
                // Add staggered animations for mobile menu items
                this.animateMobileMenuItems(navMenu);
                
                // Add haptic feedback on mobile
                this.addHapticFeedback();
            });

            // Touch gestures for mobile menu
            this.setupMobileGestures(navMenu);
        }

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
                this.resetHamburger(navToggle);
                document.body.style.overflow = '';
            });
        });

        // Enhanced smooth scroll with precise positioning
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Premium scroll effects with progress tracking
        let ticking = false;
        
        const updatePremiumNavigation = () => {
            const currentScroll = window.pageYOffset;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(currentScroll / scrollHeight, 1);
            
            // Update scroll progress bar
            if (navProgress) {
                navProgress.style.transform = `scaleX(${scrollProgress})`;
            }
            
            // Dynamic navbar styling
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Dark mode detection for hero section
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const heroRect = heroSection.getBoundingClientRect();
                if (heroRect.bottom > 0 && heroRect.top < 100) {
                    navbar.classList.add('dark-mode');
                } else {
                    navbar.classList.remove('dark-mode');
                }
            }
            
            // Active section highlighting
            this.updateActiveNavLink();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updatePremiumNavigation);
                ticking = true;
            }
        });

        // Enhanced link micro-interactions
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            });
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Section is active if it's in the top third of the viewport
            if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight + 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    animateMobileMenuItems(navMenu) {
        const links = navMenu.querySelectorAll('.nav-link');
        const cta = navMenu.querySelector('.nav-cta');
        
        if (navMenu.classList.contains('active')) {
            // Reset animations
            links.forEach((link, index) => {
                link.style.transition = 'all 0.3s ease-out';
                link.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
            });
            
            if (cta) {
                cta.style.transition = 'all 0.3s ease-out 0.4s';
            }
        } else {
            // Reverse animations
            links.forEach((link, index) => {
                link.style.transitionDelay = `${0.05 * (links.length - index)}s`;
            });
        }
    }

    addHapticFeedback() {
        // Add haptic feedback for supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // Short, subtle vibration
        }
    }

    setupMobileGestures(navMenu) {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            // Prevent scrolling when menu is open
            if (navMenu.classList.contains('active')) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e) => {
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Swipe left to close menu (minimum 100px swipe)
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 100) {
                if (navMenu.classList.contains('active')) {
                    const navToggle = document.querySelector('.nav-toggle');
                    navMenu.classList.remove('active');
                    navToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                    this.addHapticFeedback();
                }
            }
        };

        navMenu.addEventListener('touchstart', handleTouchStart, { passive: false });
        navMenu.addEventListener('touchmove', handleTouchMove, { passive: false });
        navMenu.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    animateHamburger(toggle) {
        const spans = toggle.querySelectorAll('span');
        if (toggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            this.resetHamburger(toggle);
        }
    }

    resetHamburger(toggle) {
        const spans = toggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollProgress();
                    this.updateNavbar();
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', () => {
            this.updateScrollProgress();
        });
    }

    updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) {
            // Create scroll progress indicator
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);
        }

        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollCurrent = window.pageYOffset;
        const scrollPercent = Math.min((scrollCurrent / scrollTotal), 1);
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.transform = `scaleX(${scrollPercent})`;
        }
    }

    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const scrollTop = window.pageYOffset;
        const isScrolled = scrollTop > 50;
        
        if (isScrolled) {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            navbar.style.boxShadow = 'none';
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation delays for child elements
                    const children = entry.target.querySelectorAll('.venture-card, .timeline-item, .stat-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .venture-card, .section-header');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    setupAnimations() {
        // Add entrance animations to key elements
        const animationClasses = ['fade-in', 'scale-in'];
        
        animationClasses.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    animateHeroEntrance() {
        const heroElements = [
            '.hero-overline',
            '.hero-title', 
            '.hero-subtitle',
            '.hero-buttons'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.element');
        
        if (parallaxElements.length === 0) return;

        this.parallaxElements = Array.from(parallaxElements).map((el, index) => ({
            element: el,
            speed: 0.3 + (index * 0.1),
            initialY: 0
        }));
    }

    updateParallax() {
        if (!this.parallaxElements) return;

        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(({ element, speed }) => {
            const yPos = scrollTop * speed;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    startBackgroundAnimations() {
        // Animate floating elements with more sophisticated timing
        const elements = document.querySelectorAll('.element');
        elements.forEach((element, index) => {
            const duration = 6000 + (index * 1000); // Vary duration
            const delay = index * 500; // Stagger start times
            
            element.style.animationDuration = `${duration}ms`;
            element.style.animationDelay = `${delay}ms`;
        });
    }

    setupForms() {
        const forms = document.querySelectorAll('.contact-form, .premium-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });

            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
                
                // Enhanced premium form interactions
                if (form.classList.contains('premium-form')) {
                    this.setupPremiumInput(input);
                }
            });
        });
    }

    setupPremiumInput(input) {
        // Add focus animations for premium forms
        input.addEventListener('focus', function() {
            const wrapper = this.closest('.input-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'translateY(-2px)';
            }
        });
        
        input.addEventListener('blur', function() {
            const wrapper = this.closest('.input-wrapper');
            if (wrapper) {
                wrapper.style.transform = '';
            }
        });
        
        // Handle floating labels
        input.addEventListener('input', function() {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (this.value.length > 0) {
                    label.style.transform = 'translateY(-24px) scale(0.8)';
                    label.style.color = 'var(--primary-400)';
                } else {
                    label.style.transform = '';
                    label.style.color = '';
                }
            }
        });
        
        // Initialize label state if input has value
        if (input.value) {
            const label = input.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transform = 'translateY(-24px) scale(0.8)';
                label.style.color = 'var(--primary-400)';
            }
        }
    }

    handleFormSubmission(form) {
        const button = form.querySelector('button[type="submit"]');
        const buttonText = button.querySelector('span') || button;
        const originalText = buttonText.textContent;
        const isPremiumForm = form.classList.contains('premium-form');
        
        // Show loading state
        buttonText.textContent = 'Sending...';
        button.disabled = true;
        button.style.transform = 'scale(0.98)';
        
        // Add loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'form-loading-spinner';
        spinner.style.cssText = `
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: formSpin 1s linear infinite;
            margin-left: 8px;
        `;
        button.appendChild(spinner);

        // Add spinner animation if not exists
        if (!document.getElementById('form-spinner-styles')) {
            const spinnerStyles = document.createElement('style');
            spinnerStyles.id = 'form-spinner-styles';
            spinnerStyles.textContent = `
                @keyframes formSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinnerStyles);
        }

        // Simulate form submission
        setTimeout(() => {
            buttonText.textContent = 'Sent Successfully!';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            button.style.transform = 'scale(1)';
            
            // Remove spinner
            spinner.remove();
            
            // Add success icon
            const successIcon = document.createElement('svg');
            successIcon.innerHTML = `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none"/>`;
            successIcon.setAttribute('width', '16');
            successIcon.setAttribute('height', '16');
            successIcon.setAttribute('viewBox', '0 0 24 24');
            successIcon.setAttribute('fill', 'none');
            successIcon.style.marginLeft = '8px';
            button.appendChild(successIcon);
            
            // Reset form
            form.reset();
            
            // Reset premium form labels
            if (isPremiumForm) {
                const labels = form.querySelectorAll('label');
                labels.forEach(label => {
                    label.style.transform = '';
                    label.style.color = '';
                });
            }
            
            // Reset button after delay
            setTimeout(() => {
                buttonText.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                button.style.transform = '';
                const icon = button.querySelector('svg');
                if (icon) icon.remove();
            }, 3000);
        }, 2000);
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        this.showFieldValidation(input, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(input, isValid, message) {
        const errorElement = input.parentNode.querySelector('.field-error');
        
        if (!isValid) {
            input.style.borderColor = 'var(--accent-pink)';
            
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.style.cssText = `
                    color: var(--accent-pink);
                    font-size: var(--text-xs);
                    margin-top: var(--space-1);
                `;
                error.textContent = message;
                input.parentNode.appendChild(error);
            } else {
                errorElement.textContent = message;
            }
        } else {
            input.style.borderColor = '';
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupMicroInteractions() {
        // Enhanced button interactions
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });

            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });

        // Enhanced card interactions
        const cards = document.querySelectorAll('.venture-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Optimize scroll performance
        this.throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        };

        // Add ripple effect CSS
        const rippleCSS = document.createElement('style');
        rippleCSS.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleCSS);
    }
}

// Initialize the application
const vibeWorksStudio = new VibeWorksStudio();

// Add some premium console branding
console.log('%c🚀 VibeWorks AI Studio', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%c✨ Where AI meets human magic', 'color: #8b5cf6; font-size: 16px;');
console.log('%c🎯 Loaded with premium interactions', 'color: #06b6d4; font-size: 14px;');

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('vibeWorks-loaded');
    
    window.addEventListener('load', () => {
        performance.mark('vibeWorks-complete');
        performance.measure('vibeWorks-init', 'vibeWorks-loaded', 'vibeWorks-complete');
        
        const measure = performance.getEntriesByName('vibeWorks-init')[0];
        console.log(`⚡ Initialized in ${measure.duration.toFixed(2)}ms`);
    });
}