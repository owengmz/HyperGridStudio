'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useReducedMotion } from '@/lib/useReducedMotion'

interface StatCounterProps {
  /** Valor final del conteo. */
  target: number
  /** Sufijo decorativo: "+", " dias", "*". */
  suffix: string
  label: string
}

/**
 * Contador animado del hero (bloque 5 de legacy/script.js) con `useGSAP`.
 *
 * Diferencia deliberada con legacy: el HTML renderiza el valor final en vez de
 * un "0" fijo, asi el numero real queda en el servidor para SEO y para quien
 * navegue sin JS. El callback de `useGSAP` corre en useLayoutEffect, antes del
 * primer paint, por lo que resetear a 0 para arrancar el conteo no parpadea.
 */
export function StatCounter({ target, suffix, label }: StatCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const el = numRef.current
      if (!el) return

      /* Reduced motion: se queda el valor final que ya vino del servidor. */
      if (reduced) {
        el.textContent = String(target)
        return
      }

      const counter = { value: 0 }
      el.textContent = '0'

      gsap.to(counter, {
        value: target,
        duration: 1.6,
        ease: 'power1.out',
        snap: { value: 1 },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = String(Math.floor(counter.value))
        },
      })
    },
    { dependencies: [reduced, target] },
  )

  return (
    <div className="stat" role="listitem">
      <div className="stat-row">
        <span className="stat-num" ref={numRef}>
          {target}
        </span>
        <span className="stat-suffix" aria-hidden="true">
          {suffix}
        </span>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  )
}
