/* ============================================
   Hyper Grid Studio — script.js
   Animaciones, interacciones y efectos dinamicos
   Toda la logica de UI del front-end
============================================ */

import { inject } from '@vercel/analytics';
import { translations } from './i18n.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Initialize Vercel Web Analytics
inject();

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CURSOR PERSONALIZADO
     Visible solo en dispositivos con mouse (puntero fino)
     Sigue al cursor con un punto y un rastro suave
  ───────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  /* Solo se activa si el dispositivo tiene un puntero preciso (mouse) */
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (cursor && cursorTrail && hasFinePointer) {
    /* Activa el cursor custom en CSS solo si JS funciona correctamente */
    document.body.classList.add('has-custom-cursor');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    /* Actualiza la posicion del cursor principal inmediatamente */
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }, { passive: true });

    /* El rastro sigue con lerp (interpolacion lineal) para suavidad */
    let trailRunning = true;
    const animateTrail = () => {
      if (!trailRunning) return;
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    /* Pausa el loop cuando el tab esta en segundo plano para ahorrar recursos */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trailRunning = false;
      } else {
        trailRunning = true;
        animateTrail();
      }
    });

    /* Oculta el cursor al salir del documento */
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorTrail.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorTrail.style.opacity = '1';
    });

  } else {
    /* Sin mouse: oculta los elementos del cursor personalizado */
    if (cursor) cursor.style.display = 'none';
    if (cursorTrail) cursorTrail.style.display = 'none';
  }


  /* header — referencia usada en sección 10 (scroll) y sección 3 (menú móvil) */
  const header = document.getElementById('header');


  /* ─────────────────────────────────────────
     3. MENU MOVIL / HAMBURGUESA
     Controla apertura y cierre del menu con gestion de foco
     y accesibilidad (aria-expanded, aria-hidden)
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (hamburger && mobileMenu) {
    let menuOpen = false;

    /* Funcion central para abrir o cerrar el menu movil */
    const toggleMenu = (forceClose = false) => {
      menuOpen = forceClose ? false : !menuOpen;

      /* Actualiza clases visuales */
      hamburger.classList.toggle('open', menuOpen);
      mobileMenu.classList.toggle('open', menuOpen);

      /* Actualiza atributos de accesibilidad */
      hamburger.setAttribute('aria-expanded', menuOpen.toString());
      hamburger.setAttribute('aria-label', menuOpen ? 'Cerrar menu' : 'Abrir menu');
      mobileMenu.setAttribute('aria-hidden', (!menuOpen).toString());

      /* Maneja el overlay */
      if (mobileOverlay) {
        if (menuOpen) {
          mobileOverlay.style.display = 'block';
          /* El frame siguiente activa la transicion de opacidad */
          requestAnimationFrame(() => {
            mobileOverlay.classList.add('open');
          });
        } else {
          mobileOverlay.classList.remove('open');
          /* Espera a que termine la transicion antes de ocultar */
          mobileOverlay.addEventListener('transitionend', () => {
            if (!menuOpen) mobileOverlay.style.display = '';
          }, { once: true });
        }
      }

      /* Bloquea o libera el scroll del body */
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    };

    /* Clic en el boton hamburguesa */
    hamburger.addEventListener('click', () => toggleMenu());

    /* Clic en cualquier link del menu movil cierra el menu */
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    /* Clic en el overlay oscuro cierra el menu */
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => toggleMenu(true));
    }

    /* Tecla Escape cierra el menu */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) toggleMenu(true);
    });
  }


  /* ─────────────────────────────────────────
     4. REVELADO AL SCROLL (GSAP ScrollTrigger)
     Elementos con .reveal-up o .reveal-right se animan
     cuando entran al viewport
  ───────────────────────────────────────── */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    /* Elementos que suben */
    gsap.utils.toArray('.reveal-up:not(#hero .reveal-up)').forEach(el => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
      gsap.from(el, {
        y: 32,
        opacity: 0,
        duration: 0.9,
        delay: delay, //
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* Elementos que entran desde la derecha */
    gsap.utils.toArray('.reveal-right:not(#hero .reveal-right)').forEach(el => {
      gsap.from(el, {
        x: 32,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });
    /* Hero: entrada inmediata con timeline */
    const heroTl = gsap.timeline({ delay: 0.4 }); // 
    const heroContent = document.querySelector('#hero .hero-content');
    const heroVisual = document.querySelector('#hero .hero-visual');


    if (heroContent) {
      heroTl.fromTo(
        heroContent,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }

    if (heroVisual) {
      heroTl.fromTo(
        heroVisual,
        { x: 40, opacity: 0 }, // 
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3' //
      );
    }
  } else {
    /* Reduced motion: mostrar todo directamente */
    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }


  /* ─────────────────────────────────────────
     5. CONTADORES ANIMADOS (GSAP)
     Los numeros aumentan desde 0 hasta el valor destino
     cuando entran en viewport
  ───────────────────────────────────────── */
  if (!reducedMotion) {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: 'power1.out',
        snap: { val: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        onUpdate: () => {
          el.textContent = Math.floor(obj.val);
        }
      });
    });
  } else {
    /* Sin animacion: muestra el valor final directamente */
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      el.textContent = el.getAttribute('data-target');
    });
  }


  /* ─────────────────────────────────────────
     6. BOTONES MAGNETICOS
     El boton se desplaza ligeramente hacia el cursor
     Solo en dispositivos con puntero preciso (mouse)
  ───────────────────────────────────────── */
  if (hasFinePointer && !reducedMotion) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const factor = 0.3;
        btn.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     7. ENLACE DE NAVEGACION ACTIVO (GSAP ScrollTrigger)
     Resalta el link de navegacion correspondiente a la seccion visible
  ───────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');

  if (navLinks.length) {
    document.querySelectorAll('main section[id]').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: ({ isActive }) => {
          if (isActive) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        }
      });
    });
  }


  /* ─────────────────────────────────────────
     8. EFECTO 3D EN TARJETAS DE PRECIOS
     Las tarjetas se inclinan levemente al mover el mouse
     Solo en escritorio para mejor rendimiento
  ───────────────────────────────────────── */
  if (hasFinePointer && !reducedMotion) {
    document.querySelectorAll('.pricing-card').forEach(card => {
      const isFeatured = card.classList.contains('pricing-featured');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const parts = [
          'perspective(800px)',
          'rotateY(' + (x * 8) + 'deg)',
          'rotateX(' + (y * -8) + 'deg)',
          'translateY(-4px)'
        ];
        /* La card destacada conserva su scale para no perder el estilo CSS */
        if (isFeatured) parts.push('scale(1.04)');
        card.style.transform = parts.join(' ');
      });

      card.addEventListener('mouseleave', () => {
        /* Restaura solo el scale en la card destacada, limpia las demas */
        card.style.transform = isFeatured ? 'scale(1.04)' : '';
      });
    });
  }


  /* ─────────────────────────────────────────
     9. DESTELLO DE LUZ EN TARJETAS DE SERVICIO
     Un gradiente radial sigue al cursor dentro de cada tarjeta
  ───────────────────────────────────────── */
  if (hasFinePointer) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = [
          'radial-gradient(280px circle at ' + x + 'px ' + y + 'px,',
          'rgba(16,185,129,0.07), transparent 60%),',
          'var(--bg-card)'
        ].join(' ');
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     10. FORMULARIO DE CONTACTO
     Validacion del lado del cliente antes de enviar via Formspree
     Muestra errores inline y mensaje de exito despues del envio
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const messageField = document.getElementById('message');
      const fields = [nameField, emailField, messageField];

      /* Limpia errores anteriores */
      fields.forEach(f => f && f.classList.remove('error'));

      let valid = true;

      /* Valida que cada campo tenga contenido */
      fields.forEach(field => {
        if (field && !field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      /* Valida formato de email con expresion regular basica */
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      /* Muestra estado de carga en el boton */
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Enviando...';
      }

      try {
        /* Envia el formulario a Formspree via fetch para mejor UX */
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          /* Exito: resetea el formulario y muestra el mensaje */
          contactForm.reset();
          if (formSuccess) formSuccess.classList.add('show');
          /* Oculta el mensaje de exito despues de 5 segundos */
          setTimeout(() => {
            if (formSuccess) formSuccess.classList.remove('show');
          }, 5000);
        } else {
          /* Error del servidor: restaura el boton */
          throw new Error('Error en el servidor');
        }
      } catch {
        /* Error de red: permite reintentar */
        alert('Hubo un error al enviar. Por favor intenta de nuevo o escribe directamente a WhatsApp.');
      } finally {
        /* Siempre restaura el boton de envio */
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Enviar Mensaje';
        }
      }
    });

    /* Quita el error del campo al escribir en el */
    ['name', 'email', 'message'].forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('input', () => field.classList.remove('error'));
      }
    });
  }


  /* ─────────────────────────────────────────
     11. PARALLAX DEL HERO CON SCROLL (GSAP)
     Los brillos de fondo se desplazan al hacer scroll
  ───────────────────────────────────────── */
  if (!reducedMotion) {
    const glow1 = document.querySelector('.hero-glow-1');
    const glow2 = document.querySelector('.hero-glow-2');

    if (glow1) {
      gsap.to(glow1, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    if (glow2) {
      gsap.to(glow2, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }
  }


  /* ─────────────────────────────────────────
     12. EFECTO ONDA EN BOTONES PRIMARIOS (RIPPLE)
     Un circulo expansivo aparece en el punto del clic
  ───────────────────────────────────────── */
  if (!reducedMotion) {
    /* Inyecta los keyframes del ripple una sola vez en el head */
    if (!document.getElementById('rippleKF')) {
      const style = document.createElement('style');
      style.id = 'rippleKF';
      style.textContent = '@keyframes ripple { to { transform: scale(28); opacity: 0; } }';
      document.head.appendChild(style);
    }

    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');

        /* Posiciona el elemento en el punto del clic */
        ripple.style.cssText = [
          'position:absolute',
          'border-radius:50%',
          'background:rgba(255,255,255,0.22)',
          'width:10px',
          'height:10px',
          'left:' + (x - 5) + 'px',
          'top:' + (y - 5) + 'px',
          'transform:scale(0)',
          'animation:ripple 0.55s ease-out forwards',
          'pointer-events:none'
        ].join(';');

        this.appendChild(ripple);
        /* Elimina el elemento al terminar la animacion */
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      });
    });
  }


  /* ─────────────────────────────────────────
     13. MODAL DE POLITICA DE PRIVACIDAD
     Apertura con fade-in y cierre con fade-out
     Gestion correcta de display:none y las transiciones CSS
  ───────────────────────────────────────── */
  const privacyLink = document.getElementById('privacyLink');
  const privacyModal = document.getElementById('privacyModal');
  const modalClose = document.getElementById('modalClose');

  if (privacyLink && privacyModal && modalClose) {

    /* Abre el modal con la animacion de entrada */
    const openModal = () => {
      /*
        Tecnica para fade-in correcto:
        1. Se hace el elemento visible (display:flex via visibility)
        2. En el siguiente frame se agrega la clase .open que activa opacity:1
        Esto permite que la transicion CSS tenga tiempo de ejecutarse
      */
      privacyModal.style.display = 'flex';
      privacyModal.removeAttribute('aria-hidden');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          privacyModal.classList.add('open');
        });
      });

      document.body.style.overflow = 'hidden';

      /* Foco al primer elemento interactivo dentro del modal */
      setTimeout(() => {
        const focusable = privacyModal.querySelector('button, a, input, [tabindex]');
        if (focusable) focusable.focus();
      }, 320);
    };

    /* Cierra el modal esperando que termine el fade-out */
    const closeModal = () => {
      privacyModal.classList.remove('open');
      privacyModal.setAttribute('aria-hidden', 'true');

      /* Espera a que la transicion de opacidad termine antes de ocultar */
      privacyModal.addEventListener('transitionend', () => {
        privacyModal.style.display = '';
      }, { once: true });

      document.body.style.overflow = '';
      /* Devuelve el foco al enlace que abrio el modal */
      privacyLink.focus();
    };

    /* Abre al hacer clic en el enlace del footer */
    privacyLink.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });

    /* Cierra al hacer clic en el boton X */
    modalClose.addEventListener('click', closeModal);

    /* Cierra al hacer clic fuera de la tarjeta del modal */
    privacyModal.addEventListener('click', e => {
      if (e.target === privacyModal) closeModal();
    });

    /* Cierra con la tecla Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ─────────────────────────────────────────
     14. SISTEMA DE INTERNACIONALIZACION (i18n)
         ES / EN con selector de banderas en header
  ───────────────────────────────────────── */
  (function initI18n() {
    const STORAGE_KEY = 'hgs-lang';
    const DEFAULT_LANG = 'es';

    /* Determina el idioma inicial: localStorage → default */
    let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

    /* Aplica todas las traducciones al DOM */
    function applyLang(lang) {
      const t = translations[lang];
      if (!t) return;

      /* Función helper para leer una clave anidada: "hero.title_line1" */
      function resolve(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], t);
      }

      /* data-i18n → textContent */
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = resolve(el.dataset.i18n);
        if (val !== undefined) el.textContent = val;
      });

      /* data-i18n-html → innerHTML (para textos con <br> o <span class="text-accent">) */
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const val = resolve(el.dataset.i18nHtml);
        if (val !== undefined) el.innerHTML = val;
      });

      /* data-i18n-placeholder → placeholder attribute */
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const val = resolve(el.dataset.i18nPlaceholder);
        if (val !== undefined) el.placeholder = val;
      });

      /* data-i18n-aria → aria-label attribute */
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const val = resolve(el.dataset.i18nAria);
        if (val !== undefined) el.setAttribute('aria-label', val);
      });

      /* Actualiza el atributo lang del <html> */
      document.documentElement.lang = lang;

      /* Actualiza botones del switcher */
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    }

    /* Aplica idioma guardado al cargar */
    applyLang(currentLang);

    /* Listeners en los botones del switcher */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== currentLang) applyLang(lang);
      });
    });
  })();

  /* ─────────────────────────────────────────
     10. HEADER SCROLL — transparente → glassmorphism dinámico por sección
  ───────────────────────────────────────── */
  if (header) {

    /* Toggle de la clase al primer px de scroll */
    const onScroll = () => header.classList.toggle('header-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* ejecutar al cargar por si ya hay scroll */

    /* Paleta RGB por sección — se aplica como --header-tint */
    const sectionTints = {
      hero:         '20, 10, 36',   /* morado profundo */
      about:        '10, 18, 36',   /* azul oscuro     */
      services:     '16, 10, 32',   /* violeta         */
      portfolio:    '8,  14, 28',   /* azul marino     */
      testimonials: '20, 8,  32',   /* púrpura         */
      pricing:      '10, 16, 32',   /* azul índigo     */
      contact:      '13, 11, 20',   /* neutro oscuro   */
    };

    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tint = sectionTints[entry.target.id] ?? '13, 11, 20';
          header.style.setProperty('--header-tint', tint);
        }
      });
    }, {
      threshold: 0.25   /* la sección ocupa al menos 25 % de la ventana */
    });

    sections.forEach(s => sectionObserver.observe(s));
  }

}); /* fin DOMContentLoaded */