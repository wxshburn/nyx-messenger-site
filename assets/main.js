/* ==========================================================================
   NYX MESSENGER — CORE INTERACTIVE ENGINE (V8.0)
   ========================================================================== */

(function () {
  'use strict';

  // 1. Particle Constellation Canvas
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 140 };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      const particleCount = Math.floor((width * height) / 16000);
      particles = [];

      for (let i = 0; i < Math.min(particleCount, 85); i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.75 + Math.random() * 0.95;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 1.8 + 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.35 ? '#A78BFA' : '#38BDF8'
        });
      }
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(196, 181, 253, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderParticles);
      }
    }

    window.addEventListener('resize', () => {
      initCanvas();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderParticles);
      }
    });

    initCanvas();
    if (!prefersReducedMotion) {
      renderParticles();
    }
  }

  // 2. 3D Perspective Window Tilt in Hero
  const visualWrap = document.querySelector('.hero-visual-wrap');
  const mockupWindow = document.querySelector('.mockup-window');

  if (visualWrap && mockupWindow && window.matchMedia('(min-width: 1024px)').matches) {
    visualWrap.addEventListener('mousemove', (e) => {
      const rect = visualWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 12;

      mockupWindow.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    visualWrap.addEventListener('mouseleave', () => {
      mockupWindow.style.transform = 'rotateY(-8deg) rotateX(4deg)';
    });
  }

  // 3. Spotlight Cursor Tracking on Bento Cards
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Interactive Dynamic Audio Island Demo
  const island = document.getElementById('mockupIsland');
  if (island) {
    let isPlaying = true;
    const bars = island.querySelectorAll('.island-bar');
    const badge = island.querySelector('.island-badge');

    island.addEventListener('click', () => {
      isPlaying = !isPlaying;
      bars.forEach((bar) => {
        bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
      });
      if (badge) {
        badge.textContent = isPlaying ? 'PLAYING' : 'PAUSED';
        badge.style.background = isPlaying ? 'rgba(139, 92, 246, 0.25)' : 'rgba(100, 104, 125, 0.25)';
        badge.style.color = isPlaying ? '#A78BFA' : '#9DA1B6';
      }
    });
  }

  // 5. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others
        faqItems.forEach((other) => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 6. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNavDrawer');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileBtn.textContent = isOpen ? '✕' : '☰';
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // 7. Language Switcher (RU <-> EN)
  const langSwitches = document.querySelectorAll('.lang-switch');
  langSwitches.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentPath = window.location.pathname;
      let targetPath;
      if (currentPath.includes('/en/')) {
        targetPath = currentPath.replace('/en/', '/ru/');
        localStorage.setItem('nyx-language', 'ru');
      } else {
        targetPath = currentPath.replace('/ru/', '/en/');
        localStorage.setItem('nyx-language', 'en');
      }
      window.location.href = targetPath;
    });
  });

})();
