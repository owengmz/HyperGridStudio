'use client'

import { useEffect, useRef } from 'react'

/**
 * Cursor personalizado: un punto que sigue al mouse y un rastro suavizado
 * (bloque 1 de legacy/script.js).
 *
 * Solo se activa con puntero fino. La clase `has-custom-cursor` en el body es
 * la que oculta el cursor nativo, y se agrega desde JS a proposito: si el
 * script no corre, el usuario conserva su cursor.
 *
 * Rendimiento (ver tambien .cursor en globals.css):
 *
 * - El handler de mousemove NO toca el DOM: solo guarda coordenadas. Los
 *   eventos de mouse llegan mas seguido que los frames (un mouse de 1000 Hz
 *   dispara ~8 eventos por frame a 120 Hz), asi que escribir estilos ahi
 *   multiplicaba el trabajo por nada. Un unico rAF escribe una vez por frame.
 *
 * - Se posiciona con `transform: translate3d()` y no con `left`/`top`. left/top
 *   disparan layout en cada escritura; transform se resuelve en el compositor.
 *   Esta era la causa principal del tironeo al mover el mouse.
 *
 * - El loop se detiene cuando el cursor queda quieto y arranca de nuevo con el
 *   siguiente movimiento, en vez de girar en vacio para siempre.
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
    let lastDotX = Number.NaN
    let lastDotY = Number.NaN
    let frame = 0
    let visible = true

    /* El translate(-50%, -50%) centra el elemento sobre el puntero; se aplica
       despues del desplazamiento para que no lo escale. */
    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const render = () => {
      const dotMoved = mouseX !== lastDotX || mouseY !== lastDotY
      if (dotMoved) {
        place(dot, mouseX, mouseY)
        lastDotX = mouseX
        lastDotY = mouseY
      }

      /* El rastro interpola hacia la posicion real para quedar por detras. */
      const dx = mouseX - trailX
      const dy = mouseY - trailY
      const trailMoving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1

      if (trailMoving) {
        trailX += dx * 0.12
        trailY += dy * 0.12
        place(trail, trailX, trailY)
      }

      /* Todo quieto: se corta el loop hasta el proximo movimiento. */
      if (!dotMoved && !trailMoving) {
        frame = 0
        return
      }

      frame = requestAnimationFrame(render)
    }

    const start = () => {
      if (!frame && visible) frame = requestAnimationFrame(render)
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      start()
    }

    /* Se pausa el loop con la pestana en segundo plano. */
    const onVisibilityChange = () => {
      visible = !document.hidden
      if (!visible) {
        cancelAnimationFrame(frame)
        frame = 0
      } else {
        start()
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

    return () => {
      cancelAnimationFrame(frame)
      frame = 0
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
