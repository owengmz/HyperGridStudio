/**
 * Testimonios de clientes.
 *
 * La cita y el rol viven en messages/*.json bajo `testimonials.items.<id>`.
 * El nombre del autor y el de la empresa son nombres propios y quedan aca.
 */

export type TestimonialId = 'yerin' | 'facundo' | 'andres'
export type TestimonialSource = 'google'

export interface Testimonial {
  id: TestimonialId
  /** Nombre propio: no se traduce. */
  author: string
  /**
   * Nombre propio de la empresa. null cuando no es una empresa sino un
   * descriptor traducible, que se lee de `testimonials.items.<id>.company`.
   */
  company: string | null
  /** Fallback que se muestra cuando no hay foto. */
  initials: string
  /**
   * null a proposito: las tres fotos que referencia legacy/index.html
   * (/img/testimonial-{yerin,facundo,andres}.webp) NO existen en el repo y hoy
   * dan 404. Cargar los archivos y completar la ruta para activarlas.
   */
  avatar: string | null
  /** Estrellas mostradas, sobre 5. */
  rating: number
  source: TestimonialSource
  /** Ruta de las traducciones (`.quote`, `.role` y, si aplica, `.company`). */
  i18nKey: `testimonials.items.${TestimonialId}`
}

export const testimonials: readonly Testimonial[] = [
  {
    id: 'yerin',
    author: 'Yerin Dominguez',
    company: 'Zycor Construction LLC',
    initials: 'YD',
    avatar: null,
    rating: 5,
    source: 'google',
    i18nKey: 'testimonials.items.yerin',
  },
  {
    id: 'facundo',
    author: 'Facundo Bustos',
    company: 'Wood Designs',
    initials: 'FB',
    avatar: null,
    rating: 5,
    source: 'google',
    i18nKey: 'testimonials.items.facundo',
  },
  {
    id: 'andres',
    author: 'Andrés R.',
    // "Emprendedor Digital" no es una empresa: es un descriptor traducible.
    company: null,
    initials: 'AR',
    avatar: null,
    rating: 5,
    source: 'google',
    i18nKey: 'testimonials.items.andres',
  },
]
