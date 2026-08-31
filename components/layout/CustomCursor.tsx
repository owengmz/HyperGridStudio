'use client'

import { useEffect, useRef } from 'react'

/**
 * Cursor personalizado: un punto que sigue al mouse y un rastro suavizado
 * (bloque 1 de legacy/script.js).
 *
 * Solo se activa con puntero fino. La clase `has-custom-cursor` en el body es
 * la que oculta el cursor nativo, y se agrega desde JS a proposito: si el
 * script no corre, el usuario conserva su cursor.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const trail = trailRef.current
    if (!dot || !trail) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.body.classList.add('has-custom-cursor')

    let mouseX = 0
    let mouseY = 0
    let trailX = 0
    let trailY = 0
    let frame = 0
    let running = true

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
    }

    /* El rastro interpola hacia la posicion real para quedar por detras. */
    const animateTrail = () => {
      if (!running) return
      trailX += (mouseX - trailX) * 0.12
      trailY += (mouseY - trailY) * 0.12
      trail.style.left = `${trailX}px`
      trail.style.top = `${trailY}px`
      frame = requestAnimationFrame(animateTrail)
    }

    /* Se pausa el loop con la pestana en segundo plano. */
    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        animateTrail()
      }
    }

    const setOpacity = (value: string) => () => {
      dot.style.opacity = value
      trail.style.opacity = value
    }

    const onLeave = setOpacity('0')
    const onEnter = setOpacity('1')

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    animateTrail()

    return () => {
      running = false
      cancelAnimationFrame(frame)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor" id="cursor" ref={dotRef} aria-hidden="true" />
      <div className="cursor-trail" id="cursorTrail" ref={trailRef} aria-hidden="true" />
    </>
  )
}
