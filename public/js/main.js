/**
 * Portfolio Website - Main JavaScript
 * Ashutosh Kumar Yadav
 * 
 * Features:
 * - Smooth scroll navigation
 * - Scroll-triggered reveal animations
 * - Mobile navigation toggle
 * - Back to top button
 * - Active nav link highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeToggle();
  initNavigation();
  initScrollReveal();
  initBackToTop();
  initActiveNavLinks();
  initSmoothScroll();
  initFormHandling();
  // initOrbitingEmojis(); // Disabled per user request
  initAvatarAnimation();
  initAudioToggle();
});

/**
 * Avatar Profile Animation (Cycling Logos)
 */
function initAvatarAnimation() {
  const profileImg = document.querySelector('.profile-img');
  if (!profileImg) return;

  const frames = [
    'assets/images/frames/frame_0.png',
    'assets/images/frames/frame_1.png',
    'assets/images/frames/frame_2.png',
    'assets/images/frames/frame_3.png'
  ];

  // Preload images
  frames.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let currentFrame = 0;

  setInterval(() => {
    currentFrame = (currentFrame + 1) % frames.length;
    profileImg.src = frames[currentFrame];
  }, 1000); // 1 second interval
}

/**
 * Orbiting Emojis Animation
 */
function initOrbitingEmojis() {
  const container = document.getElementById('heroOrbit');
  if (!container) return;

  const emojis = [
    // Space & Sci-Fi
    '☄️', '🪐', '👽', '🛸', '🌑', '⭐', '🌌', '🚀', '🛰️', '🔭', '👾', '🤖',
    // Dinosaurs & Ancient
    '🦖', '🦕', '🌋', '🦴', '🥚', '🦠', '🧬',
    // Nature & Elements
    '🌱', '🌿', '🌵', '🌴', '🌲', '🍄', '🪨', '🌪️', '🔥', '⚡', '❄️', '🌊',
    // Tech & Hardware
    '💾', '💿', '📼', '📷', '🔋', '🔌', '🕹️', '🧱', '🧪', '⚙️', '🎰', '🎲'
  ];

  function spawnEmoji() {
    const emoji = document.createElement('div');
    emoji.className = 'orbit-object';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random start position on circle edge
    const startAngle = Math.random() * Math.PI * 2;
    const endAngle = startAngle + Math.PI * (0.5 + Math.random()); // Move 90-270 degrees
    const radius = 160; // Circle radius

    const startX = 160 + Math.cos(startAngle) * radius;
    const startY = 160 + Math.sin(startAngle) * radius;
    const endX = 160 + Math.cos(endAngle) * radius;
    const endY = 160 + Math.sin(endAngle) * radius;

    // Set initial position
    emoji.style.left = startX + 'px';
    emoji.style.top = startY + 'px';
    emoji.style.opacity = '0';

    container.appendChild(emoji);

    // Animate
    const duration = 3000 + Math.random() * 2000;
    const keyframes = [
      { left: startX + 'px', top: startY + 'px', opacity: 0, transform: 'scale(0.5)' },
      { left: (startX + endX) / 2 + 'px', top: (startY + endY) / 2 - 20 + 'px', opacity: 1, transform: 'scale(1)', offset: 0.5 },
      { left: endX + 'px', top: endY + 'px', opacity: 0, transform: 'scale(0.5)' }
    ];

    emoji.animate(keyframes, {
      duration: duration,
      easing: 'ease-in-out'
    }).onfinish = () => emoji.remove();
  }

  // Spawn emojis at random intervals
  function scheduleNext() {
    setTimeout(() => {
      spawnEmoji();
      scheduleNext();
    }, 400 + Math.random() * 800);
  }

  // Start spawning
  scheduleNext();
}

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
  }

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme === 'light' ? 'light' : '');
    localStorage.setItem('theme', newTheme);
  });
}

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
      if (navLinks.classList.contains('active')) {
        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        span.style.transform = 'none';
        span.style.opacity = '1';
      }
    });
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    });
  });
}

/**
 * Scroll-triggered Reveal Animations
 * Uses Intersection Observer for performance
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing after reveal
        // revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');

  if (!backToTop) return;

  // Show/hide based on scroll position
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', throttle(toggleBackToTop, 100));

  // Scroll to top on click
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Active Navigation Link Highlighting
 */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const highlightNav = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', throttle(highlightNav, 100));
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Form Handling
 * Shows a success message after form submission
 */
function initFormHandling() {
  const form = document.querySelector('.contact-form');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    // If using Formspree or similar, let it handle the submission
    // This is for visual feedback
    const submitBtn = form.querySelector('.form-submit');

    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Note: If you're handling the form with JavaScript,
      // you would reset the button after completion
      // For now, letting the form submit naturally
    }
  });
}

/**
 * Utility: Throttle Function
 * Limits the rate at which a function can fire
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Utility: Debounce Function
 * Delays function execution until after waiting period
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Add navbar background on scroll - uses CSS classes instead of inline styles
 */
window.addEventListener('scroll', throttle(() => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}, 100));

/**
 * Typing effect for hero (optional enhancement)
 * Uncomment to enable
 */
/*
function initTypingEffect() {
  const titles = ['Software Engineer', 'Backend Developer', 'AI Enthusiast'];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;
  
  const element = document.querySelector('.hero-typing');
  
  if (!element) return;
  
  function type() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      element.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }
    
    if (!isDeleting && charIndex === currentTitle.length) {
      setTimeout(() => isDeleting = true, pauseTime);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, speed);
  }
  
  type();
}
*/

/**
 * Audio Toggle
 */
function initAudioToggle() {
  const audioToggle = document.getElementById('audioToggle');
  const bgMusic = document.getElementById('bgMusic');

  if (!audioToggle || !bgMusic) return;

  bgMusic.volume = 0.3;

  audioToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      audioToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      audioToggle.classList.remove('playing');
    }
  });
}
