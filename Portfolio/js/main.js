// ===== MAIN APPLICATION CONTROLLER =====

class PortfolioApp {
  constructor() {
    this.isTerminalOpen = false;
    this.particles = [];
    this.connections = [];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupIntersectionObserver();
    this.animateStats();
    this.createParticleSystem();
    this.setupGlitchEffects();
    
    // Initialize on DOM load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMReady();
      });
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    this.updateActiveNavLink();
    this.startTypingAnimation();
    this.initializeScrollIndicator();
  }

  setupEventListeners() {
    // Navigation toggle for mobile
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('active')));
      });
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Smooth scrolling for anchor links (if any)
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Terminal toggle
    const terminalToggle = document.getElementById('terminal-toggle');
    const interactiveTerminal = document.getElementById('interactive-terminal');
    
    if (terminalToggle && interactiveTerminal) {
      terminalToggle.addEventListener('click', () => {
        this.toggleTerminal();
      });
    }

    // Terminal close button
    const terminalClose = document.getElementById('terminal-close');
    if (terminalClose) {
      terminalClose.addEventListener('click', () => {
        this.closeTerminal();
      });
    }

    // Escape key to close terminal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isTerminalOpen) {
        this.closeTerminal();
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Scroll handler for navbar
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  startTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animationDelay = `${index * 0.5}s`;
        element.classList.add('active');
      }, index * 500);
    });

    // Show terminal output with delay
    const outputLines = document.querySelectorAll('.output-line');
    outputLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 2000 + (index * 800));
    });
  }

  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumber = (element) => {
      const target = Number(element.getAttribute('data-count'));
      if (!Number.isFinite(target)) return;
      const prefix = element.getAttribute('data-prefix') || '';
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = `${prefix}${Math.floor(current)}${suffix}`;
      }, 16);
    };

    // Animate when elements come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
      '.card, .timeline-item, .project-card'
    );
    
    animateElements.forEach(el => observer.observe(el));
  }

  initializeAnimations() {
    // Add staggered animation delays
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

    // Initialize floating elements
    const floatingElements = document.querySelectorAll('.float-effect');
    floatingElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });
  }

  createParticleSystem() {
    const particlesContainer = document.getElementById('particles-background');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.createParticle(particlesContainer);
    }

    // Start particle animation loop
    this.animateParticles();
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const sizes = ['small', '', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    if (randomSize) particle.classList.add(randomSize);
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    container.appendChild(particle);
    
    this.particles.push({
      element: particle,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  animateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
      
      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
    });
    
    requestAnimationFrame(() => this.animateParticles());
  }

  setupGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-effect');
    
    glitchElements.forEach(element => {
      // Add data-text attribute for pseudo-elements
      element.setAttribute('data-text', element.textContent);
      
      // Random glitch trigger
      setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
          element.classList.add('glitching');
          setTimeout(() => {
            element.classList.remove('glitching');
          }, 200);
        }
      }, 3000);
    });
  }

  toggleTerminal() {
    const terminal = document.getElementById('interactive-terminal');
    const toggleBtn = document.getElementById('terminal-toggle');
    
    if (!terminal || !toggleBtn) return;
    
    if (this.isTerminalOpen) {
      this.closeTerminal();
    } else {
      this.openTerminal();
    }
  }

  openTerminal() {
    const terminal = document.getElementById('interactive-terminal');
    const toggleBtn = document.getElementById('terminal-toggle');
    const terminalInput = document.getElementById('terminal-input');
    
    if (!terminal) return;
    
    terminal.classList.add('active');
    toggleBtn.classList.add('hidden');
    this.isTerminalOpen = true;
    
    // Focus on terminal input
    setTimeout(() => {
      if (terminalInput) terminalInput.focus();
    }, 300);
  }

  closeTerminal() {
    const terminal = document.getElementById('interactive-terminal');
    const toggleBtn = document.getElementById('terminal-toggle');
    
    if (!terminal) return;
    
    terminal.classList.remove('active');
    toggleBtn.classList.remove('hidden');
    this.isTerminalOpen = false;
  }

  handleResize() {
    // Recreate particle system on resize
    if (window.innerWidth < 768) {
      // Reduce particles on mobile
      this.createParticleSystem();
    }
    
    // Recalculate scroll indicator visibility on resize
    this.initializeScrollIndicator();
  }

  initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-down-indicator');
    if (scrollIndicator) {
      // Initial check on page load
      setTimeout(() => {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollableHeight = documentHeight - windowHeight;
        
        // Hide if there's not significant content to scroll (consistent with handleScroll)
        if (scrollableHeight < 300) {
          scrollIndicator.classList.add('hidden');
        } else {
          scrollIndicator.classList.remove('hidden');
        }
      }, 100); // Small delay to ensure content is loaded
    }
  }

  handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-down-indicator');
    
    // Update navbar background
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
      }
    }
    
    // Show/hide scroll indicator with improved logic
    if (scrollIndicator) {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      
      // Only show indicator if there's significant content to scroll
      if (scrollableHeight < 300) {
        scrollIndicator.classList.add('hidden');
        return;
      }
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;
      
      // Dynamic threshold based on content length
      let hideThreshold;
      if (scrollableHeight > 2000) {
        // Long content - hide after scrolling 15%
        hideThreshold = 15;
      } else if (scrollableHeight > 1000) {
        // Medium content - hide after scrolling 25%
        hideThreshold = 25;
      } else {
        // Shorter content - hide after scrolling 40%
        hideThreshold = 40;
      }
      
      // Hide indicator when scrolled past threshold or near bottom (within 150px)
      const nearBottom = (scrollableHeight - scrollTop) < 150;
      
      if (scrollPercentage > hideThreshold || nearBottom) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    }
  }

  // Utility methods
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

  // Copy to clipboard utility
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification('Copied to clipboard!', 'success');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Copied to clipboard!', 'success');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-secondary);
      color: var(--color-text-primary);
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      border: 1px solid var(--color-accent);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main application
  window.portfolioApp = new PortfolioApp();

  // Add loading complete class
  document.body.classList.add('loaded');
});
