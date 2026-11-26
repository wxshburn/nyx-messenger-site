/* NYX Shared Interactive & Visual Engine (Particles, Scroll Reveals, Mobile Menu, Language Switch) */
(() => {
  // 1. High-FPS Sprite-Cached Particle Starfield
  const canvas = document.getElementById("particles-bg");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (ctx) {
      let width = 0, height = 0, particles = [], rafId = 0;
      const colors = ["224,220,255", "173,160,255", "145,139,190"];
      const sprites = colors.map((rgb) => {
        const c = document.createElement("canvas");
        c.width = 24;
        c.height = 24;
        const gctx = c.getContext("2d");
        const grad = gctx.createRadialGradient(12, 12, 0.5, 12, 12, 11);
        grad.addColorStop(0, `rgba(${rgb},1)`);
        grad.addColorStop(0.32, `rgba(${rgb},0.85)`);
        grad.addColorStop(0.65, `rgba(${rgb},0.18)`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, 24, 24);
        return c;
      });

      function resize() {
        const oldWidth = width, oldHeight = height, oldParticles = particles;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const mobile = width < 700;
        const areaCount = Math.floor((width * height) / (mobile ? 6500 : 5200));
        const count = Math.max(mobile ? 65 : 110, Math.min(mobile ? 115 : 220, areaCount));
        particles = oldParticles.slice(0, count).map((p) => ({
          ...p,
          x: oldWidth ? (p.x / oldWidth) * width : Math.random() * width,
          y: oldHeight ? (p.y / oldHeight) * height : Math.random() * height,
        }));
        while (particles.length < count) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.9 + Math.random() * 1.6,
            vx: (Math.random() - 0.5) * 0.55,
            vy: (Math.random() - 0.5) * 0.55,
            alpha: 0.42 + Math.random() * 0.5,
            spriteIdx: Math.floor(Math.random() * sprites.length),
          });
        }
        render(0);
      }

      let lastTime = 0;
      function render(dtScale) {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          if (dtScale > 0) {
            p.x += p.vx * dtScale;
            p.y += p.vy * dtScale;
            if (p.x < -8) p.x = width + 8;
            if (p.x > width + 8) p.x = -8;
            if (p.y < -8) p.y = height + 8;
            if (p.y > height + 8) p.y = -8;
          }
          const size = p.radius * 4.4;
          ctx.globalAlpha = p.alpha;
          ctx.drawImage(sprites[p.spriteIdx], p.x - size * 0.5, p.y - size * 0.5, size, size);
        }
        ctx.globalAlpha = 1;
      }

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min(48, timestamp - lastTime);
        lastTime = timestamp;
        render(dt / 16.667);
        rafId = window.requestAnimationFrame(animate);
      }

      function handleVisibility() {
        if (document.hidden) {
          if (rafId) window.cancelAnimationFrame(rafId);
          rafId = 0;
        } else if (!rafId) {
          lastTime = 0;
          rafId = window.requestAnimationFrame(animate);
        }
      }

      let lastViewportWidth = window.innerWidth;
      window.addEventListener("resize", () => {
        if (Math.abs(window.innerWidth - lastViewportWidth) > 2) {
          lastViewportWidth = window.innerWidth;
          resize();
        }
      }, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
      resize();
      if ("requestAnimationFrame" in window) {
        rafId = window.requestAnimationFrame(animate);
      }
    }
  }

  // 2. Smooth Scroll Reveals (with sibling stagger)
  if ("IntersectionObserver" in window) {
    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    if (revealItems.length) {
      document.querySelectorAll(".cards-grid, .legal-grid, .faq-list").forEach((group) => {
        group.querySelectorAll(".reveal").forEach((el, idx) => {
          el.style.transitionDelay = Math.min(idx * 55, 240) + "ms";
        });
      });
      document.documentElement.classList.add("has-reveal");
      try {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        }, { threshold: 0.02, rootMargin: "0px 0px -2% 0px" });
        revealItems.forEach((el) => observer.observe(el));
        requestAnimationFrame(() => revealItems.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) el.classList.add("visible");
        }));
      } catch (_e) {
        document.documentElement.classList.remove("has-reveal");
        revealItems.forEach((el) => el.classList.add("visible"));
      }
    }
  }

  // 3. Mobile Navigation Drawer
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  if (menuToggle && siteNav) {
    const isEn = document.documentElement.lang === "en";
    const closeMenu = () => {
      siteNav.classList.remove("open");
      document.body.classList.remove("mobile-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", isEn ? "Open navigation" : "Открыть меню");
      menuToggle.textContent = "☰";
    };
    menuToggle.addEventListener("click", () => {
      const opened = siteNav.classList.toggle("open");
      document.body.classList.toggle("mobile-menu-open", opened);
      menuToggle.setAttribute("aria-expanded", String(opened));
      menuToggle.setAttribute("aria-label", opened ? (isEn ? "Close navigation" : "Закрыть меню") : (isEn ? "Open navigation" : "Открыть меню"));
      menuToggle.textContent = opened ? "✕" : "☰";
    });
    siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    document.addEventListener("click", (e) => {
      if (siteNav.classList.contains("open") && !siteNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
    });
  }

  // 4. Language Switcher
  const langBtn = document.getElementById("lang");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const isEn = document.documentElement.lang === "en";
      const target = isEn ? "ru" : "en";
      try { localStorage.setItem("nyx-language", target); } catch (_e) {}
      location.href = location.pathname.replace(/^\/(ru|en)(?=\/|$)/, "/" + target);
    });
  }
})();
