'use client'

import { useEffect, useState } from 'react'

/**
 * `prefers-reduced-motion: reduce` del usuario.
 *
 * Arranca en false para que el HTML del servidor y el del cliente coincidan;
 * el valor real llega en el primer efecto. A diferencia de legacy/script.js,
 * que lo leia una sola vez al cargar, este hook reacciona si el usuario cambia
 * la preferencia del sistema con la pagina abierta.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
