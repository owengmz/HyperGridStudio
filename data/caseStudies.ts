/**
 * Pines de las capturas de un caso de estudio.
 *
 * Un pin es un punto marcado sobre una captura que se enciende junto a su
 * entrada de la leyenda: al pasar el mouse o tabular por la fila de la
 * leyenda, el punto correspondiente de la imagen recibe `.is-on`, y al reves.
 * El vinculo entre los dos lo hace `data-pin`, que comparten el punto y la
 * fila.
 *
 * Las coordenadas van en porcentaje del ancho y del alto de la captura, no en
 * pixeles: la imagen se sirve responsive (de 372px a 760px de columna, ademas
 * del 2x) y un offset fijo se despegaria del detalle que senala en cuanto
 * cambia el tamanio renderizado.
 *
 * El texto de cada pin NO vive aca: es copy y va en messages/*.json, igual que
 * los `alt` de las capturas. Este archivo solo tiene la geometria, que es la
 * misma en los dos idiomas.
 */

export interface CasePin {
  /**
   * Identificador dentro de la captura. Es el valor de `data-pin` y tiene que
   * ser unico entre los pines de la misma imagen.
   */
  id: string
  /** Distancia desde el borde izquierdo, en % del ancho de la captura (0-100). */
  x: number
  /** Distancia desde el borde superior, en % del alto de la captura (0-100). */
  y: number
  /**
   * Indice de la entrada de la leyenda que enciende este pin, contra el array
   * `pins` del namespace de la captura en messages/. Se declara aparte del
   * orden del array para poder reordenar los puntos sin tocar el copy.
   */
  labelIndex: number
}

export interface CaseStudyImage {
  /** Ruta bajo /public, la misma que el `src` de la captura en messages/. */
  src: string
  pins: readonly CasePin[]
}

export interface CaseStudy {
  id: string
  /** Namespace de messages/ del que sale el copy de la leyenda. */
  i18nKey: string
  images: readonly CaseStudyImage[]
}

/**
 * miPost — punto de venta para kioscos.
 *
 * TODO(pines): faltan las coordenadas. Las capturas reales todavia no estan en
 * /public/img (el `src` de `pages.software_pos.sections[2].images` sigue
 * vacio, que es como ServicePageContent evita renderizar un 404). En cuanto
 * esten, se miden los puntos sobre la imagen y se completan los `pins`, junto
 * con el array `pins` de copy en messages/es.json y messages/en.json.
 *
 * Hasta entonces los arrays quedan vacios a proposito: PinnedFigure no
 * renderiza la capa de pines si no hay ninguno, asi que la seccion se ve como
 * hoy y no se publica ningun punto apuntando a un lugar inventado.
 */
export const caseStudies: readonly CaseStudy[] = [
  {
    id: 'mipost',
    i18nKey: 'pages.software_pos.sections.2',
    images: [
      { src: '/img/mipost-ventas.webp', pins: [] },
      { src: '/img/mipost-cobro.webp', pins: [] },
    ],
  },
]

/** Busca un caso de estudio por id. `undefined` si no existe. */
export function getCaseStudy(id: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.id === id)
}

/**
 * Pines declarados para una captura, buscada por su ruta.
 *
 * La `src` es la misma cadena en messages/ y aca, asi que alcanza para cruzar
 * el copy con la geometria sin que la seccion tenga que saber a que caso de
 * estudio pertenece. Devuelve un array vacio si la captura no esta declarada o
 * si todavia no tiene coordenadas, que hoy es el caso de las dos de miPost.
 */
export function getPinsForImage(src: string): readonly CasePin[] {
  for (const caseStudy of caseStudies) {
    const image = caseStudy.images.find((candidate) => candidate.src === src)
    if (image) return image.pins
  }

  return []
}
