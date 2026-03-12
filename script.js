/* ============================================
   Hyper Grid Studio — script.js
   Animaciones, interacciones y efectos dinamicos
   Toda la logica de UI del front-end
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CURSOR PERSONALIZADO
     Visible solo en dispositivos con mouse (puntero fino)
     Sigue al cursor con un punto y un rastro suave
  ───────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  /* Solo se activa si el dispositivo tiene un puntero preciso (mouse) */
  const hasFinePonter = window.matchMedia('(pointer: fine)').matches;

  if (cursor && cursorTrail && hasFinePonter) {
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
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    };
    animateTrail();

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


  /* ─────────────────────────────────────────
     2. EFECTO DE CABECERA AL HACER SCROLL
     Agrega la clase .scrolled cuando el usuario baja 40px
  ───────────────────────────────────────── */
  const header = document.getElementById('header');

  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    /* Ejecutar una vez al cargar por si ya hay scroll */
    handleScroll();
  }


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
     4. REVELADO AL SCROLL (IntersectionObserver)
     Elementos con .reveal-up o .reveal-right se animan
     cuando entran al viewport
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  /* Si prefers-reduced-motion esta activo, muestra todo de inmediato */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* Deja de observar una vez que el elemento es visible */
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));

    /* Activa los elementos del hero sin esperar el scroll */
    document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 100);
    });
  }


  /* ─────────────────────────────────────────
     5. CONTADORES ANIMADOS
     Los numeros aumentan desde 0 hasta el valor destino
     cuando entran en viewport
  ───────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  if (!reducedMotion && statNums.length) {
    const countUp = el => {
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
  } else {
    /* Sin animacion: muestra el valor final directamente */
    statNums.forEach(el => {
      el.textContent = el.getAttribute('data-target');
    });
  }


  /* ─────────────────────────────────────────
     6. BOTONES MAGNETICOS
     El boton se desplaza ligeramente hacia el cursor
     Solo en dispositivos con puntero preciso (mouse)
  ───────────────────────────────────────── */
  if (hasFinePonter && !reducedMotion) {
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
     7. ENLACE DE NAVEGACION ACTIVO
     Resalta el link de navegacion correspondiente a la seccion visible
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(s => navObserver.observe(s));
  }


  /* ─────────────────────────────────────────
     8. EFECTO 3D EN TARJETAS DE PRECIOS
     Las tarjetas se inclinan levemente al mover el mouse
     Solo en escritorio para mejor rendimiento
  ───────────────────────────────────────── */
  if (hasFinePonter && !reducedMotion) {
    document.querySelectorAll('.pricing-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = [
          'perspective(800px)',
          'rotateY(' + (x * 8) + 'deg)',
          'rotateX(' + (y * -8) + 'deg)',
          'translateY(-4px)'
        ].join(' ');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     9. DESTELLO DE LUZ EN TARJETAS DE SERVICIO
     Un gradiente radial sigue al cursor dentro de cada tarjeta
  ───────────────────────────────────────── */
  if (hasFinePonter) {
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
     11. PARALLAX — BRILLO DEL HERO AL MOVER EL MOUSE
     Los brillos de fondo se desplazan suavemente segun la posicion del cursor
     Solo en escritorio para no afectar el rendimiento en movil
  ───────────────────────────────────────── */
  if (hasFinePonter && !reducedMotion) {
    const glow1 = document.querySelector('.hero-glow-1');
    const glow2 = document.querySelector('.hero-glow-2');

    if (glow1 || glow2) {
      document.addEventListener('mousemove', e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        if (glow1) glow1.style.transform = 'translate(' + (dx * 24) + 'px, ' + (dy * 24) + 'px)';
        if (glow2) glow2.style.transform = 'translate(' + (-dx * 18) + 'px, ' + (-dy * 18) + 'px)';
      }, { passive: true });
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

}); /* fin DOMContentLoaded */