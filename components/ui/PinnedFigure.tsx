'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CasePin } from '@/data/caseStudies'

/**
 * Captura anotada de un caso de estudio.
 *
 * Sobre la imagen van puntos numerados; debajo, la leyenda que los explica.
 * Al pasar el mouse o tabular por una fila de la leyenda se enciende su punto,
 * y al reves. El vinculo lo hace `data-pin`, que comparten el punto y la fila,
 * y el estado se expresa con la clase `.is-on` en los dos.
 *
 * Por que el estado vive en React y no en `:hover` de CSS: la relacion va en
 * los dos sentidos entre dos elementos que no son hermanos ni ancestro/
 * descendiente (el punto esta dentro de la figura, la fila dentro de la
 * leyenda), asi que no hay combinador que los enlace. Un solo `useState` con
 * el id activo cubre los dos lados.
 *
 * Accesibilidad:
 *
 * - Las filas de la leyenda son `<button>`, no `<li>` con handlers: se llega
 *   con Tab, responden a focus/blur igual que a hover y el lector de pantalla
 *   las anuncia como accionables.
 * - `is-on` es puramente visual y solo duplica lo que la leyenda ya dice en
 *   texto, asi que los puntos van `aria-hidden`: para quien no ve la imagen,
 *   la leyenda por si sola es el contenido completo.
 * - Sin pines, no se renderiza la capa ni la leyenda: queda la captura sola.
 */

/** Medidas intrinsecas de las capturas, las mismas que usa ServicePageContent. */
const IMAGE_WIDTH = 1600
const IMAGE_HEIGHT = 900

export interface PinnedFigureProps {
  src: string
  alt: string
  /** Geometria de los puntos; sale de data/caseStudies.ts. */
  pins: readonly CasePin[]
  /** Copy de la leyenda; sale de messages/. Se indexa con `pin.labelIndex`. */
  labels: readonly string[]
  sizes?: string
  priority?: boolean
}

export function PinnedFigure({
  src,
  alt,
  pins,
  labels,
  sizes = '(max-width: 800px) 92vw, 760px',
  priority = false,
}: PinnedFigureProps) {
  /* Id del pin encendido, o null si no hay ninguno. */
  const [activePin, setActivePin] = useState<string | null>(null)

  /* Un pin sin su texto no se muestra: seria un punto sin explicacion. */
  const visiblePins = pins.filter((pin) => labels[pin.labelIndex])

  return (
    <figure className="pinned-figure">
      <div className="pinned-figure-frame">
        <Image
          className="service-image"
          src={src}
          alt={alt}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          sizes={sizes}
          {...(priority ? { priority: true } : { loading: 'lazy' as const })}
        />

        {visiblePins.length > 0 && (
          <div className="pin-layer" aria-hidden="true">
            {visiblePins.map((pin, index) => (
              <span
                key={pin.id}
                className={`pin${activePin === pin.id ? ' is-on' : ''}`}
                data-pin={pin.id}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                {index + 1}
              </span>
            ))}
          </div>
        )}
      </div>

      {visiblePins.length > 0 && (
        <figcaption className="pin-key">
          {visiblePins.map((pin, index) => (
            <button
              key={pin.id}
              type="button"
              className={`pin-key-item${activePin === pin.id ? ' is-on' : ''}`}
              data-pin={pin.id}
              onMouseEnter={() => setActivePin(pin.id)}
              onMouseLeave={() => setActivePin(null)}
              onFocus={() => setActivePin(pin.id)}
              onBlur={() => setActivePin(null)}
            >
              <span className="pin-key-index">{index + 1}</span>
              <span className="pin-key-label">{labels[pin.labelIndex]}</span>
            </button>
          ))}
        </figcaption>
      )}
    </figure>
  )
}
