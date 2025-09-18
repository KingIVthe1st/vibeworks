// ================================
// VIBEWORKS MOBILE OPTIMIZATIONS
// Strategic Touch & Performance Enhancements
// ================================

class MobileOptimizations {
    constructor() {
        this.touchStartX = null;
        this.touchStartY = null;
        this.isMenuOpen = false;
        this.currentVentureCard = 0;
        this.init();
    }

    init() {
        if (this.isMobile()) {
            this.optimizeMobileLoading();
            this.setupMobileNavigation();
            this.setupSwipeGestures();
            this.setupTouchInteractions();
            this.setupMobilePerformance();
            this.setupImageLazyLoading();
            this.setupFormEnhancements();
            this.setupScrollOptimizations();
            this.setupViewportHeight();
        }
    }

    // Optimize mobile loading to prevent blue screen issues
    optimizeMobileLoading() {
        const loadingScreen = document.getElementById('loading-screen');

        if (loadingScreen) {
            // Reduce loading time on mobile for better UX
            const originalDuration = 3500;
            const mobileDuration = 1500; // Much faster on mobile

            // Override the loading screen display immediately
            loadingScreen.style.background = 'var(--neutral-900)'; // Force dark background
            loadingScreen.style.zIndex = '99999';

            // Force early completion on mobile if page is already loaded
            if (document.readyState === 'complete') {
                setTimeout(() => {
                    this.forceCompleteLoading(loadingScreen);
                }, 500);
            } else {
                // Set up fast mobile loading
                setTimeout(() => {
                    this.forceCompleteLoading(loadingScreen);
                }, mobileDuration);
            }
        }
    }

    forceCompleteLoading(loadingScreen) {
        if (loadingScreen && loadingScreen.parentNode) {
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            loadingScreen.style.opacity = '0';

            setTimeout(() => {
                loadingScreen.remove();
                // Ensure body is properly visible
                document.body.style.visibility = 'visible';
                document.body.style.opacity = '1';
            }, 500);
        }
    }

    isMobile() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }

    // Enhanced Mobile Navigation
    setupMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const navLinks = document.querySelectorAll('[data-mobile-close]');

        if (!navToggle || !navMenu) return;

        // Toggle menu
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu on overlay click
        menuOverlay?.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });

        // Prevent body scroll when menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.isMenuOpen) {
                e.preventDefault();
            }
        }, { passive: false });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        this.isMenuOpen = !this.isMenuOpen;

        if (this.isMenuOpen) {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            navToggle.setAttribute('aria-expanded', 'true');

            // Animate menu items
            this.animateMenuItems();
        } else {
            this.closeMenu();
        }
    }

    closeMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        this.isMenuOpen = false;
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        menuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
        navToggle?.setAttribute('aria-expanded', 'false');
    }

    animateMenuItems() {
        const menuItems = document.querySelectorAll('.nav-menu .nav-link, .nav-menu .nav-cta');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';

            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }

    // Swipe Gestures for Venture Cards
    setupSwipeGestures() {
        const ventureCards = document.querySelectorAll('.venture-card');

        ventureCards.forEach(card => {
            let startX = 0;
            let startY = 0;
            let distX = 0;
            let distY = 0;

            card.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });

            card.addEventListener('touchmove', (e) => {
                if (!startX || !startY) return;

                distX = e.touches[0].clientX - startX;
                distY = e.touches[0].clientY - startY;

                // Horizontal swipe detection
                if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 30) {
                    card.style.transform = `translateX(${distX * 0.5}px) scale(0.98)`;
                    card.style.opacity = 1 - Math.abs(distX) / 300;
                }
            }, { passive: true });

            card.addEventListener('touchend', (e) => {
                if (Math.abs(distX) > 100) {
                    // Swipe action triggered
                    this.handleCardSwipe(card, distX > 0 ? 'right' : 'left');
                } else {
                    // Reset position
                    card.style.transform = '';
                    card.style.opacity = '';
                }

                startX = 0;
                startY = 0;
                distX = 0;
                distY = 0;
            }, { passive: true });
        });
    }

    handleCardSwipe(card, direction) {
        // Animate card off screen
        card.style.transition = 'all 0.3s ease';
        card.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'}) scale(0.8)`;
        card.style.opacity = '0';

        // Reset after animation
        setTimeout(() => {
            card.style.transition = '';
            card.style.transform = '';
            card.style.opacity = '';

            // Trigger link if swiped right
            if (direction === 'right') {
                const link = card.querySelector('.venture-link');
                if (link) {
                    window.open(link.href, '_blank');
                }
            }
        }, 300);
    }

    // Enhanced Touch Interactions
    setupTouchInteractions() {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn, button, .venture-overlay-link');

        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function(e) {
                this.classList.add('touch-active');

                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('touch-ripple');

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            }, { passive: true });

            btn.addEventListener('touchend', function() {
                setTimeout(() => this.classList.remove('touch-active'), 100);
            }, { passive: true });
        });
    }

    // Mobile Performance Optimizations
    setupMobilePerformance() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        }, { passive: true });

        // Optimize scroll performance
        let scrollTimeout;
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                document.body.classList.add('is-scrolling');
                isScrolling = true;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
                isScrolling = false;
            }, 150);
        }, { passive: true });

        // Reduce animation complexity during scroll
        this.setupReducedMotion();
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduced-motion');
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('reduced-motion');
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        });
    }

    // Optimized Image Lazy Loading
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Load image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
            });
        }
    }

    // Form Enhancements
    setupFormEnhancements() {
        const forms = document.querySelectorAll('.premium-form');

        forms.forEach(form => {
            // Auto-resize textareas
            const textareas = form.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                });
            });

            // Add floating labels
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });

                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });

                // Check if already filled
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            });

            // Smooth form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Add loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;

                    // Simulate submission
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.classList.add('success');
                        submitBtn.textContent = 'Submitted!';

                        setTimeout(() => {
                            form.reset();
                            submitBtn.classList.remove('success');
                            submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
                            submitBtn.disabled = false;
                        }, 2000);
                    }, 1500);
                }
            });
        });
    }

    // Scroll Optimizations
    setupScrollOptimizations() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Hide/show navbar on scroll
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                navbar.classList.remove('navbar-hidden');
                return;
            }

            if (currentScroll > lastScroll && !this.isMenuOpen) {
                // Scrolling down
                navbar.classList.add('navbar-hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('navbar-hidden');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Fix viewport height on mobile
    setupViewportHeight() {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }
}

// Initialize mobile optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileOptimizations();
    });
} else {
    new MobileOptimizations();
}