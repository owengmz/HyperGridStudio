'use client'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * Animaciones de entrada y de scroll, portadas de legacy/script.js
 * (bloques 4, 7 y 11) a `useGSAP`.
 *
 * Se monta una sola vez y trabaja por selector de documento, igual que el
 * script original. Asi las secciones y las cards siguen siendo Server
 * Components: solo declaran `reveal-up` / `reveal-right` y `--delay`, sin
 * volverse cliente para poder animarse.
 *
 * No se pasa `scope` a proposito: acotaria los selectores a un subarbol y estas
 * animaciones apuntan a elementos repartidos por toda la pagina. `useGSAP`
 * igual revierte tweens y ScrollTriggers al desmontar o al cambiar `reduced`.
 */
export function PageAnimations() {
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      /* Sin animaciones si el usuario pidio menos movimiento. Los elementos ya
         son visibles por defecto: el CSS no los arranca en opacity 0. */
      if (reduced) return

      /* ── Revelado al scroll ──
         El hero queda excluido: entra con su propio timeline, sin esperar scroll. */
      gsap.utils.toArray<HTMLElement>('.reveal-up:not(#hero .reveal-up)').forEach((el) => {
        const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          delay,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('.reveal-right:not(#hero .reveal-right)').forEach((el) => {
        gsap.from(el, {
          x: 32,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      /* ── Entrada del hero ── */
      const heroTl = gsap.timeline({ delay: 0.4 })
      const heroContent = document.querySelector('#hero .hero-content')
      const heroVisual = document.querySelector('#hero .hero-visual')

      if (heroContent) {
        heroTl.fromTo(
          heroContent,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        )
      }

      if (heroVisual) {
        heroTl.fromTo(
          heroVisual,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3',
        )
      }

      /*
        ── Parallax de los brillos del hero: eliminado ──

        Legacy ataba .hero-glow-1 y .hero-glow-2 al scroll con dos tweens de
        `y` y scrub 1.5. Nunca se vieron: las dos clases traen
        `animation: floatGlow` en el CSS, y una animacion CSS en curso gana en
        la cascada por encima del estilo inline que escribe GSAP. El resultado
        eran dos tweens con scrub recalculando y escribiendo transform en cada
        frame de scroll, sobre elementos de 900px y 600px con blur(100px),
        para producir cero efecto visible.

        Si se quiere el parallax de verdad, hay que sacar antes la animacion
        floatGlow del CSS; es una decision visual de la Etapa 3.
      */

      /* ── Link de navegacion activo segun la seccion visible ── */
      const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link')

      if (navLinks.length) {
        document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 40%',
            end: 'bottom 40%',
            onToggle: ({ isActive }) => {
              if (!isActive) return
              const id = section.getAttribute('id')
              navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
              })
            },
          })
        })
      }
    },
    { dependencies: [reduced] },
  )

  return null
}
