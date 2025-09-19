// ================================
// ADVANCED MOBILE OPTIMIZATION SUITE
// Industry-Leading Mobile Experience
// ================================

class AdvancedMobileOptimizer {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.intersectionObserver = null;
        this.networkStatus = 'online';
        this.isLowPowerMode = false;
        this.lastScrollY = 0;
        this.readingProgress = 0;
        this.init();
    }

    init() {
        if (this.isMobile()) {
            this.setupAdvancedOptimizations();
            this.setupProgressiveEnhancements();
            this.setupSmartScrolling();
            this.setupGestureControls();
            this.setupMicroInteractions();
            this.setupPerformanceMonitoring();
            this.setupConversionOptimization();
            this.setupPWAFeatures();
        }
    }

    isMobile() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }

    // Advanced Performance Optimizations
    setupAdvancedOptimizations() {
        // Critical CSS Inlining
        this.inlineCriticalCSS();

        // Preload Critical Resources
        this.preloadCriticalResources();

        // Network-Aware Loading
        this.setupNetworkAwareLoading();

        // Battery Status Monitoring
        this.setupBatteryOptimization();

        // Memory Management
        this.setupMemoryManagement();
    }

    inlineCriticalCSS() {
        // Extract and inline critical above-the-fold CSS
        const criticalStyles = `
            .hero{min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;}
            .navbar{height:64px;position:fixed;top:0;width:100%;z-index:9999;}
            .hero-content{width:100%;max-width:480px;text-align:center;}
        `;

        const style = document.createElement('style');
        style.innerHTML = criticalStyles;
        document.head.insertBefore(style, document.head.firstChild);
    }

    preloadCriticalResources() {
        const resources = [
            { href: 'logo-test.png', as: 'image' },
            { href: 'styles.css', as: 'style' },
            { href: 'mobile-optimizations.css', as: 'style' }
        ];

        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    setupNetworkAwareLoading() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.networkStatus = connection.effectiveType;

            // Adjust quality based on connection
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.documentElement.classList.add('low-bandwidth');
                this.setupLowBandwidthMode();
            }

            connection.addEventListener('change', () => {
                this.networkStatus = connection.effectiveType;
                this.updateNetworkUI();
            });
        }
    }

    setupLowBandwidthMode() {
        // Disable heavy animations
        document.documentElement.classList.add('reduced-motion');

        // Load lower quality images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.lowres) {
                img.src = img.dataset.lowres;
            }
        });
    }

    updateNetworkUI() {
        const indicator = this.createNetworkIndicator();

        if (this.networkStatus === 'slow-2g' || this.networkStatus === '2g') {
            indicator.textContent = '⚠️ Slow connection detected - Optimizing experience';
            indicator.classList.add('slow');
        } else if (!navigator.onLine) {
            indicator.textContent = '📱 You\'re offline - Some features may be limited';
            indicator.classList.add('offline');
        } else {
            indicator.style.transform = 'translateY(-100%)';
        }
    }

    createNetworkIndicator() {
        let indicator = document.querySelector('.network-status');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'network-status';
            document.body.appendChild(indicator);
        }
        return indicator;
    }

    setupBatteryOptimization() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.isLowPowerMode = battery.level < 0.2;

                if (this.isLowPowerMode) {
                    document.documentElement.classList.add('power-save-mode');
                    this.enablePowerSaveMode();
                }

                battery.addEventListener('levelchange', () => {
                    this.isLowPowerMode = battery.level < 0.2;
                    if (this.isLowPowerMode) {
                        this.enablePowerSaveMode();
                    }
                });
            });
        }
    }

    enablePowerSaveMode() {
        // Reduce animation frequency
        document.documentElement.style.setProperty('--animation-duration', '0.1s');

        // Disable non-essential features
        const nonEssential = document.querySelectorAll('.fab, .scroll-indicator');
        nonEssential.forEach(el => el.style.display = 'none');
    }

    // Progressive Enhancement Features
    setupProgressiveEnhancements() {
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.setupProgressiveImages();
        this.setupSkeletonScreens();
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');

                        // Lazy load content
                        if (entry.target.dataset.lazyLoad) {
                            this.loadContent(entry.target);
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        // Observe elements
        const observeElements = document.querySelectorAll('.slide-up, [data-lazy-load]');
        observeElements.forEach(el => this.intersectionObserver.observe(el));
    }

    setupLazyLoading() {
        // Enhanced image lazy loading
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImageProgressive(img);
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(img => imageObserver.observe(img));
    }

    loadImageProgressive(img) {
        // Create a new image for loading
        const imageLoader = new Image();

        imageLoader.onload = () => {
            img.src = imageLoader.src;
            img.classList.add('loaded');

            // Remove placeholder
            const placeholder = img.parentElement.querySelector('.placeholder');
            if (placeholder) {
                setTimeout(() => placeholder.remove(), 300);
            }
        };

        // Load appropriate format based on browser support
        if (this.supportsWebP()) {
            imageLoader.src = img.dataset.webp || img.dataset.src;
        } else {
            imageLoader.src = img.dataset.src;
        }
    }

    supportsWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Smart Scrolling and Gestures
    setupSmartScrolling() {
        this.setupReadingProgress();
        this.setupSmartNavigation();
        this.setupScrollToTop();
        this.setupPullToRefresh();
    }

    setupReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;

            progressBar.style.width = `${Math.min(progress, 100)}%`;
            this.readingProgress = progress;
        };

        window.addEventListener('scroll', this.throttle(updateProgress, 16), { passive: true });
    }

    setupSmartNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.pageYOffset;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', this.throttle(handleScroll, 100), { passive: true });
    }

    setupScrollToTop() {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↑';
        document.body.appendChild(scrollIndicator);

        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollIndicator.classList.add('visible');
            } else {
                scrollIndicator.classList.remove('visible');
            }
        }, { passive: true });
    }

    setupPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        const threshold = 80;

        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-to-refresh';
        refreshIndicator.innerHTML = '↻';
        document.body.appendChild(refreshIndicator);

        document.addEventListener('touchstart', (e) => {
            if (window.pageYOffset === 0) {
                startY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (window.pageYOffset === 0 && startY) {
                pullDistance = e.touches[0].clientY - startY;

                if (pullDistance > 0) {
                    const progress = Math.min(pullDistance / threshold, 1);
                    refreshIndicator.style.top = `${(progress * 80) - 60}px`;

                    if (progress >= 1) {
                        refreshIndicator.classList.add('ready');
                    }
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (pullDistance >= threshold) {
                this.performRefresh();
            }

            refreshIndicator.style.top = '-60px';
            refreshIndicator.classList.remove('ready');
            startY = 0;
            pullDistance = 0;
        }, { passive: true });
    }

    performRefresh() {
        const refreshIndicator = document.querySelector('.pull-to-refresh');
        refreshIndicator.classList.add('refreshing');

        // Simulate refresh action
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Micro-interactions and Haptic Feedback
    setupMicroInteractions() {
        this.setupRippleEffect();
        this.setupHapticFeedback();
        this.setupFloatingActionButton();
        this.setupStickyCTA();
    }

    setupRippleEffect() {
        const rippleElements = document.querySelectorAll('.btn, .venture-card, .nav-toggle');

        rippleElements.forEach(element => {
            element.classList.add('ripple-container');

            element.addEventListener('touchstart', (e) => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');

                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                element.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            }, { passive: true });
        });
    }

    setupHapticFeedback() {
        if ('vibrate' in navigator) {
            const hapticElements = document.querySelectorAll('.btn, .nav-toggle, .venture-overlay-link');

            hapticElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    // Light haptic feedback
                    navigator.vibrate(10);
                }, { passive: true });
            });
        }
    }

    setupFloatingActionButton() {
        const fab = document.createElement('div');
        fab.className = 'fab';
        fab.innerHTML = '💬';
        fab.title = 'Contact Us';
        document.body.appendChild(fab);

        // Show FAB after user scrolls
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        }, { passive: true });

        fab.addEventListener('click', () => {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    setupStickyCTA() {
        const stickyCTA = document.createElement('div');
        stickyCTA.className = 'mobile-sticky-cta';
        stickyCTA.innerHTML = `
            <button class="btn btn-primary">Start Your AI Journey</button>
        `;
        document.body.appendChild(stickyCTA);

        // Show sticky CTA intelligently
        let hasShown = false;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent > 30 && !hasShown) {
                stickyCTA.classList.add('visible');
                hasShown = true;
            }
        }, { passive: true });

        stickyCTA.querySelector('.btn').addEventListener('click', () => {
            document.querySelector('#founders').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Web Vitals tracking
        this.trackWebVitals();

        // Memory usage monitoring
        this.monitorMemoryUsage();

        // Frame rate monitoring
        this.monitorFrameRate();
    }

    trackWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            const firstInput = entryList.getEntries()[0];
            console.log('FID:', firstInput.processingStart - firstInput.startTime);
        }).observe({ entryTypes: ['first-input'] });
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > 50000000) { // 50MB threshold
                    this.optimizeMemory();
                }
            }, 30000);
        }
    }

    optimizeMemory() {
        // Remove unused images from DOM
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.bottom < -500 || rect.top > window.innerHeight + 500) {
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
            }
        });
    }

    // Utility Functions
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return (...args) => {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Conversion Optimization
    setupConversionOptimization() {
        this.setupExitIntent();
        this.setupScrollDepthTracking();
        this.setupFormOptimization();
    }

    setupExitIntent() {
        // Mobile exit intent detection
        let hasTriggered = false;

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !hasTriggered && this.readingProgress > 20) {
                hasTriggered = true;
                this.showExitIntentModal();
            }
        });
    }

    showExitIntentModal() {
        const modal = document.createElement('div');
        modal.className = 'bottom-sheet visible';
        modal.innerHTML = `
            <div class="bottom-sheet-handle"></div>
            <div style="padding: 24px;">
                <h3>Wait! Don't miss out 🚀</h3>
                <p>Join our exclusive community and get early access to new AI tools.</p>
                <button class="btn btn-primary" style="width: 100%; margin-top: 16px;">
                    Get Exclusive Access
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => modal.remove(), 10000);
    }

    // PWA Features
    setupPWAFeatures() {
        this.setupInstallPrompt();
        this.setupOfflineSupport();
        this.registerServiceWorker();
    }

    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button after user engagement
            setTimeout(() => {
                if (this.readingProgress > 50) {
                    this.showInstallPrompt(deferredPrompt);
                }
            }, 30000);
        });
    }

    showInstallPrompt(deferredPrompt) {
        const installBanner = document.createElement('div');
        installBanner.className = 'mobile-sticky-cta visible';
        installBanner.innerHTML = `
            <button class="btn btn-primary">📱 Install App</button>
        `;

        installBanner.querySelector('.btn').addEventListener('click', () => {
            deferredPrompt.prompt();
            installBanner.remove();
        });

        document.body.appendChild(installBanner);
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AdvancedMobileOptimizer();
    });
} else {
    new AdvancedMobileOptimizer();
}