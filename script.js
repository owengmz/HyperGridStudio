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
/* ─────────────────────────────────────────
     MODAL POLÍTICA DE PRIVACIDAD
  ───────────────────────────────────────── */
const privacyLink = document.getElementById('privacyLink');
const privacyModal = document.getElementById('privacyModal');
const modalClose = document.getElementById('modalClose');

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
/* ============================================
   script.js — Optimizado para rendimiento
   Todos los cambios estan comentados con la razon del cambio.
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------
     1. CURSOR PERSONALIZADO

     MODIFICADO: se agrego la verificacion isDesktop antes de activar
     el cursor y el requestAnimationFrame.

     POR QUE: el cursor personalizado usaba requestAnimationFrame de forma
     permanente (un loop infinito) sin importar si el dispositivo tenia
     puntero o no. En movil esto ocupaba el hilo principal innecesariamente
     cada frame (~60 veces por segundo) contribuyendo al TBT (Total Blocking Time).

     pointer:fine detecta dispositivos con puntero de precision (mouse, trackpad).
     Los moviles usan pointer:coarse (dedo) o pointer:none, por lo que isDesktop
     sera false en celulares y el cursor jamas se inicializa.

     MODIFICADO: se agrego cancelAnimationFrame cuando la pestana esta oculta.
     POR QUE: si el usuario cambia de pestana el loop seguia corriendo en segundo
     plano consumiendo CPU y bateria. Al escuchar visibilitychange se pausa y
     reactiva solo cuando la pestana vuelve a estar visible.
  ----------------------------------------- */
  const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 769px)').matches;

  if (isDesktop) {
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let rafId;

    /* MODIFICADO: se agrego { passive: true } al listener de mousemove.
       POR QUE: le indica al navegador que este listener nunca llamara a
       preventDefault(), permitiendole optimizar el scroll sin esperar
       a que el listener termine de ejecutarse. Mejora el rendimiento del scroll. */
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


  /* -----------------------------------------
     2. EFECTO EN CABECERA AL DESPLAZAR

     MODIFICADO: se agrego { passive: true } al scroll listener.
     POR QUE: igual que con mousemove, le dice al navegador que este
     listener no llama a preventDefault(), mejorando el rendimiento del scroll
     especialmente en moviles donde el scroll fluido es critico.
  ----------------------------------------- */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* -----------------------------------------
     3. HAMBURGUESA / MENU MOVIL

     MODIFICADO: se actualiza aria-expanded y aria-hidden al abrir/cerrar.
     POR QUE: mejora la accesibilidad. Los lectores de pantalla usan estos
     atributos para saber el estado actual del menu y comunicarselo al usuario.
     Sin esto un usuario con lector de pantalla no sabria si el menu esta
     abierto o cerrado.
  ----------------------------------------- */
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


  /* -----------------------------------------
     4. REVELADO AL SCROLL (IntersectionObserver)
     Sin cambios de logica. IntersectionObserver es la forma correcta de
     detectar elementos en vista sin usar scroll listeners activos.
  ----------------------------------------- */
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

  /* El hero se activa inmediatamente sin esperar el scroll */
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });


  /* -----------------------------------------
     5. CONTADORES ANIMADOS
     Sin cambios de logica. Se mantiene el IntersectionObserver con
     threshold alto (0.6) para que el contador empiece cuando el
     elemento esta bien visible, no apenas entra en pantalla.
  ----------------------------------------- */
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


  /* -----------------------------------------
     6. BOTONES MAGNETICOS

     MODIFICADO: envuelto en if (isDesktop).
     POR QUE: en movil no existe el concepto de "mover el raton sobre el boton",
     por lo que registrar estos listeners en celulares era codigo muerto que
     ocupaba memoria y tiempo de procesamiento innecesariamente.
  ----------------------------------------- */
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


  /* -----------------------------------------
     7. ENLACE DE NAVEGACION ACTIVO
     Sin cambios. IntersectionObserver es la forma correcta de hacer esto,
     no un scroll listener que calcula posiciones manualmente.
  ----------------------------------------- */
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


  /* -----------------------------------------
     8. INCLINACION DE CARDS DE PRECIOS (solo desktop)

     MODIFICADO: envuelto en if (isDesktop).
     POR QUE: igual que los botones magneticos, en movil no hay mouse.
     Registrar listeners de mousemove en tarjetas en celulares era
     procesamiento innecesario que contribuia al TBT.
  ----------------------------------------- */
  if (isDesktop) {
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
  }


  /* -----------------------------------------
     9. DESTELLO EN CARDS DE SERVICIO (solo desktop)

     MODIFICADO: envuelto en if (isDesktop).
     POR QUE: misma razon que las cards de precios. El efecto radial
     que sigue al cursor no tiene sentido en pantallas tactiles.
  ----------------------------------------- */
  if (isDesktop) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `
          radial-gradient(280px circle at ${x}px ${y}px, rgba(16,185,129,0.07), transparent 60%),
          var(--bg-card)
        `;
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }


  /* -----------------------------------------
     10. FORMULARIO DE CONTACTO

     MODIFICADO: se agrego comprobacion de existencia del formulario
     antes de registrar el listener.
     POR QUE: en el codigo original se llamaba a contactForm.addEventListener
     sin verificar si el elemento existia. Si por algun motivo el elemento
     no existia en el DOM el script lanzaba un error que detenia toda ejecucion
     posterior, rompiendo todas las funcionalidades que seguian.
  ----------------------------------------- */
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

      /* Solo bloquea el envio si hay errores de validacion */
      if (!valid) e.preventDefault();
    });
  }


  /* -----------------------------------------
     11. PARALLAX DEL HERO (solo desktop)

     MODIFICADO: envuelto en if (isDesktop) y se agrego throttle con RAF.

     POR QUE isDesktop: en movil el parallax con mousemove no funciona
     (no hay mouse). El deviceorientation podria usarse pero agrega
     complejidad y consume bateria. Se omite en movil completamente.

     POR QUE throttle con RAF: el evento mousemove dispara ~60 o mas veces
     por segundo. Sin throttle cada evento calculaba y aplicaba transformaciones
     al DOM, lo que es muy costoso. Con el patron de throttle usando RAF:
     - Se guarda la ultima posicion del mouse en variables
     - Se ejecuta un solo frame de RAF por ciclo de 16ms
     - El DOM solo se modifica una vez por frame, no 60+ veces por segundo
     Esto reduce el trabajo del hilo principal significativamente.
  ----------------------------------------- */
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


  /* -----------------------------------------
     12. EFECTO ONDA EN BOTONES PRINCIPALES

     MODIFICADO: se inyectan los keyframes UNA SOLA VEZ fuera del listener de clic.
     POR QUE: en el codigo original los keyframes se inyectaban dentro del handler
     de clic con una verificacion de ID. Inyectar estilos dentro de click handlers
     es una practica suboptima. Al moverlo afuera se ejecuta una sola vez al cargar
     y nunca mas, reduciendo el trabajo en cada clic.
  ----------------------------------------- */
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


  /* -----------------------------------------
     13. ESTILO DE ENLACE ACTIVO

     MODIFICADO: se simplifica el textContent del estilo inyectado.
     POR QUE: el estilo original tenia saltos de linea y espacios innecesarios
     dentro del string. Aunque es un cambio menor, los strings CSS inyectados
     via JS deben ser lo mas compactos posible.
  ----------------------------------------- */
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav-link.active{color:var(--primary)!important}.nav-link.active::after{width:100%!important}`;
  document.head.appendChild(activeStyle);

});


/* -----------------------------------------
   MODAL POLITICA DE PRIVACIDAD

   MODIFICADO: se agrego comprobacion de existencia de los 3 elementos
   antes de registrar los listeners.
   POR QUE: igual que el formulario, si alguno de estos elementos no existe
   en el DOM el codigo original lanzaba un error critico que romperia
   todas las funcionalidades anteriores de este bloque de codigo.

   NOTA: este bloque esta FUERA del DOMContentLoaded original pero funciona
   igual porque los scripts con defer se ejecutan despues de que el DOM
   esta completamente parseado.
----------------------------------------- */
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