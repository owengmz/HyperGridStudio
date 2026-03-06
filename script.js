/* ============================================
   DevPort — script.js
   Animaciones, interacciones y efectos dinamicos
   Contiene la logica de UI del front-end
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CURSOR PERSONALIZADO
     Sigue el puntero con un punto y un rastro suave
  ───────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '1';
  });


  /* ─────────────────────────────────────────
     2. EFECTO EN CABECERA AL DESPLAZAR
     Añade clase .scrolled cuando el usuario baja
  ───────────────────────────────────────── */
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─────────────────────────────────────────
     3. HAMBURGUESA / MENU MOVIL
     Controla la apertura y cierre del menu en dispositivos pequenos
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });


  /* ─────────────────────────────────────────
     4. REVELADO AL SCROLL (IntersectionObserver)
     Desliza elementos hacia arriba o a la derecha al aparecer
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

  /* Activa el hero inmediatamente */
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });


  /* ─────────────────────────────────────────
     5. CONTADORES ANIMADOS
     Numeros que aumentan cuando entran en vista
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
     7. BOTONES MAGNETICOS
     Mueven ligeramente el boton hacia el cursor
  ───────────────────────────────────────── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const factor = 0.35;
      btn.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────
     8. ENLACE DE NAVEGACION ACTIVO
     Resalta la seccion actual en el menu segun el scroll
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => navObserver.observe(s));


  /* ─────────────────────────────────────────
     9. INCLINACION DE CARDS DE PRECIOS
     Efecto 3D al mover el raton sobre tarjetas
  ───────────────────────────────────────── */
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateY(${x * 8}deg)
        rotateX(${-y * 8}deg)
        translateY(-4px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────
     10. DESTELLO EN CARDS DE SERVICIO
     Iluminacion radial que sigue el cursor
  ───────────────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.background = `
        radial-gradient(
          280px circle at ${x}px ${y}px,
          rgba(16,185,129,0.07),
          transparent 60%
        ),
        var(--bg-card)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });


  /* ─────────────────────────────────────────
     11. FORMULARIO DE CONTACTO
     Validacion simple y simulacion de envio
  ───────────────────────────────────────── */
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

    if (!valid) {
      e.preventDefault(); // solo bloquea si hay errores
    }
  });

  /* ─────────────────────────────────────────
     12. PARALLAX — brillo del hero al mover el mouse
     Desplaza capas de resplandor para crear profundidad
  ───────────────────────────────────────── */
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (glow1) glow1.style.transform = `translate(${dx * 24}px, ${dy * 24}px)`;
    if (glow2) glow2.style.transform = `translate(${-dx * 18}px, ${-dy * 18}px)`;
  });


  /* ─────────────────────────────────────────
     13. EFECTO ONDA EN BOTONES PRINCIPALES
     Genera un circulo expansivo al hacer clic
  ───────────────────────────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: 10px; height: 10px;
        left: ${x - 5}px; top: ${y - 5}px;
        transform: scale(0);
        animation: ripple 0.55s ease-out forwards;
        pointer-events: none;
      `;

      /* Inyecta keyframes una sola vez */
      if (!document.getElementById('rippleKF')) {
        const style = document.createElement('style');
        style.id = 'rippleKF';
        style.textContent = `
          @keyframes ripple {
            to { transform: scale(28); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* ─────────────────────────────────────────
     14. ESTILO DE ENLACE ACTIVO (ayuda CSS)
     Inyecta regla para destacar el enlace seleccionado
  ───────────────────────────────────────── */
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-link.active { color: var(--primary) !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(activeStyle);

});
