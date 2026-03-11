/* ============================================
   script.js — Optimizado para rendimiento
   Mejoras: cursor condicional, throttle en mousemove,
   cancelación de RAF, passive listeners
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CURSOR PERSONALIZADO
     OPTIMIZACION: Solo se activa en desktop.
     El RAF se cancela cuando la pestaña esta oculta.
  ───────────────────────────────────────── */
  const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 769px)').matches;

  if (isDesktop) {
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let rafId;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }, { passive: true });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
      rafId = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // OPTIMIZACION: Pausar RAF cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        animateTrail();
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorTrail.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorTrail.style.opacity = '1';
    });
  }


  /* ─────────────────────────────────────────
     2. EFECTO EN CABECERA AL DESPLAZAR
  ───────────────────────────────────────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ─────────────────────────────────────────
     3. HAMBURGUESA / MENU MOVIL
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });


  /* ─────────────────────────────────────────
     4. REVELADO AL SCROLL (IntersectionObserver)
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // Activa el hero inmediatamente
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });


  /* ─────────────────────────────────────────
     5. CONTADORES ANIMADOS
  ───────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const step = 16;
    const steps = duration / step;
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  };

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statNums.forEach(el => statsObserver.observe(el));


  /* ─────────────────────────────────────────
     6. BOTONES MAGNETICOS
  ───────────────────────────────────────── */
  if (isDesktop) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     7. ENLACE DE NAVEGACIÓN ACTIVO
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => navObserver.observe(s));


  /* ─────────────────────────────────────────
     8. INCLINACIÓN DE CARDS DE PRECIOS (solo desktop)
     OPTIMIZACION: Solo en desktop para no gastar en touch
  ───────────────────────────────────────── */
  if (isDesktop) {
    document.querySelectorAll('.pricing-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     9. DESTELLO EN CARDS DE SERVICIO (solo desktop)
  ───────────────────────────────────────── */
  if (isDesktop) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(280px circle at ${x}px ${y}px, rgba(16,185,129,0.07), transparent 60%), var(--bg-card)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     10. FORMULARIO DE CONTACTO
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      let valid = true;

      [name, email, message].forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        valid = false;
      }

      if (!valid) e.preventDefault();
    });
  }


  /* ─────────────────────────────────────────
     11. PARALLAX — brillo del hero
     OPTIMIZACION: throttle con requestAnimationFrame
     para no saturar el hilo principal
  ───────────────────────────────────────── */
  if (isDesktop) {
    const glow1 = document.querySelector('.hero-glow-1');
    const glow2 = document.querySelector('.hero-glow-2');

    if (glow1 && glow2) {
      let parallaxScheduled = false;
      let lastX = 0, lastY = 0;

      document.addEventListener('mousemove', e => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!parallaxScheduled) {
          parallaxScheduled = true;
          requestAnimationFrame(() => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (lastX - cx) / cx;
            const dy = (lastY - cy) / cy;
            glow1.style.transform = `translate(${dx * 24}px, ${dy * 24}px)`;
            glow2.style.transform = `translate(${-dx * 18}px, ${-dy * 18}px)`;
            parallaxScheduled = false;
          });
        }
      }, { passive: true });
    }
  }


  /* ─────────────────────────────────────────
     12. EFECTO ONDA EN BOTONES PRINCIPALES
  ───────────────────────────────────────── */
  // Inyecta keyframes una sola vez
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes ripple { to { transform: scale(28); opacity: 0; } }`;
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;background:rgba(255,255,255,.25);
        width:10px;height:10px;left:${x - 5}px;top:${y - 5}px;
        transform:scale(0);animation:ripple .55s ease-out forwards;pointer-events:none;
      `;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* ─────────────────────────────────────────
     13. ESTILO DE ENLACE ACTIVO
  ───────────────────────────────────────── */
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav-link.active{color:var(--primary)!important}.nav-link.active::after{width:100%!important}`;
  document.head.appendChild(activeStyle);

});


/* ─────────────────────────────────────────
   MODAL POLÍTICA DE PRIVACIDAD
───────────────────────────────────────── */
const privacyLink = document.getElementById('privacyLink');
const privacyModal = document.getElementById('privacyModal');
const modalClose = document.getElementById('modalClose');

if (privacyLink && privacyModal && modalClose) {
  privacyLink.addEventListener('click', e => {
    e.preventDefault();
    privacyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  modalClose.addEventListener('click', () => {
    privacyModal.classList.remove('open');
    document.body.style.overflow = '';
  });

  privacyModal.addEventListener('click', e => {
    if (e.target === privacyModal) {
      privacyModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}