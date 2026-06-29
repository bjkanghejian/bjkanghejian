/**
 * Beijing Kanghejian Technology Co., Ltd
 * Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize all modules
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initCounterAnimations();
    initFormValidation();
    initSmoothScroll();
});

/**
 * Loading Screen
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (loadingScreen) {
        // Hide loading screen after page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        });
    }
}

/**
 * Navigation
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (mobileClose) {
            mobileClose.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        // Close mobile menu when clicking on links
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close mobile menu when clicking outside
        mobileNav.addEventListener('click', function(e) {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(element) {
        revealObserver.observe(element);
    });
}

/**
 * Animations
 */
function initAnimations() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroBackground = heroSection.querySelector('.hero-particles');
            
            if (heroBackground) {
                heroBackground.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            }
        });
    }

    // Card hover effects enhancement
    const cards = document.querySelectorAll('.card, .team-member, .news-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });

    // Gradient animation for buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(function(button) {
        button.addEventListener('mouseenter', function() {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'translateY(0)';
        });
    });

    // Image lazy loading with fade effect
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}

/**
 * Counter Animations
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.hero-stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = function() {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        // Add suffix if exists
                        const suffix = counter.getAttribute('data-suffix') || '';
                        counter.textContent = target + suffix;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(function(input) {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you for your message. We will get back to you soon!', 'success');
                form.reset();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                if (input.hasAttribute('required')) {
                    validateField(input);
                }
            });

            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Update UI
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        removeFieldError(field);
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Notification System
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .notification-message {
        font-size: 0.95rem;
    }
`;
document.head.appendChild(notificationStyles);

/**
 * Utility Functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// Export functions for use in other modules
window.Kanghejian = {
    showNotification: showNotification,
    debounce: debounce,
    throttle: throttle
};
