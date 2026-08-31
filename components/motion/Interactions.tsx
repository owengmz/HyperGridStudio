'use client'

import { useEffect } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * Micro-interacciones de puntero portadas de legacy/script.js
 * (bloques 6, 8, 9 y 12). Ninguna usa GSAP en el original y se mantienen en
 * JS plano para no cambiar el resultado visual.
 *
 * Igual que PageAnimations, se monta una vez y trabaja por selector, de modo
 * que ServiceCard y PricingCard siguen siendo Server Components.
 */
export function Interactions() {
  const reduced = useReducedMotion()

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    const cleanups: Array<() => void> = []

    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement,
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void,
    ) => {
      el.addEventListener(type, handler)
      cleanups.push(() => el.removeEventListener(type, handler))
    }

    /* ── Botones magneticos ── */
    if (!reduced) {
      document.querySelectorAll<HTMLElement>('.magnetic').forEach((btn) => {
        on(btn, 'mousemove', (event) => {
          const rect = btn.getBoundingClientRect()
          const dx = event.clientX - rect.left - rect.width / 2
          const dy = event.clientY - rect.top - rect.height / 2
          const factor = 0.15
          btn.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`
        })
        on(btn, 'mouseleave', () => {
          btn.style.transform = ''
        })
      })
    }

    /* ── Inclinacion 3D de las tarjetas de precios ── */
    if (hasFinePointer && !reduced) {
      document.querySelectorAll<HTMLElement>('.pricing-card').forEach((card) => {
        const isFeatured = card.classList.contains('pricing-featured')

        on(card, 'mousemove', (event) => {
          const rect = card.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width - 0.5
          const y = (event.clientY - rect.top) / rect.height - 0.5
          const parts = [
            'perspective(800px)',
            `rotateY(${x * 8}deg)`,
            `rotateX(${y * -8}deg)`,
            'translateY(-4px)',
          ]
          /* La destacada conserva su scale para no perder el estilo del CSS. */
          if (isFeatured) parts.push('scale(1.04)')
          card.style.transform = parts.join(' ')
        })

        on(card, 'mouseleave', () => {
          card.style.transform = isFeatured ? 'scale(1.04)' : ''
        })
      })
    }

    /* ── Destello que sigue al cursor dentro de las tarjetas de servicio ── */
    if (hasFinePointer) {
      document.querySelectorAll<HTMLElement>('.service-card').forEach((card) => {
        on(card, 'mousemove', (event) => {
          const rect = card.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          card.style.background = [
            `radial-gradient(280px circle at ${x}px ${y}px,`,
            'rgba(16,185,129,0.07), transparent 60%),',
            'var(--bg-card)',
          ].join(' ')
        })

        on(card, 'mouseleave', () => {
          card.style.background = ''
        })
      })
    }

    /* ── Onda al hacer clic en los botones primarios ── */
    if (!reduced) {
      if (!document.getElementById('rippleKF')) {
        const style = document.createElement('style')
        style.id = 'rippleKF'
        style.textContent = '@keyframes ripple { to { transform: scale(28); opacity: 0; } }'
        document.head.appendChild(style)
      }

      document.querySelectorAll<HTMLElement>('.btn-primary').forEach((btn) => {
        on(btn, 'click', (event) => {
          const rect = btn.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          const ripple = document.createElement('span')

          ripple.style.cssText = [
            'position:absolute',
            'border-radius:50%',
            'background:rgba(255,255,255,0.22)',
            'width:10px',
            'height:10px',
            `left:${x - 5}px`,
            `top:${y - 5}px`,
            'transform:scale(0)',
            'animation:ripple 0.55s ease-out forwards',
            'pointer-events:none',
          ].join(';')

          btn.appendChild(ripple)
          ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
        })
      })
    }

    return () => cleanups.forEach((off) => off())
  }, [reduced])

  return null
}
