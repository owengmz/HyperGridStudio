/**
 * Proyectos del portafolio.
 *
 * Los textos (categoria, descripcion, CTA, alt, pais y tipo) viven en
 * messages/*.json. En legacy los chips de pais y tipo estaban hardcodeados en
 * espanol y no se traducian al cambiar de idioma: aca pasan por i18n.
 */

export type ProjectId = 'zycor' | 'wood'
export type ProjectStatus = 'live' | 'coming-soon'
export type CountryCode = 'us' | 'ar'
export type ProjectType = 'landing' | 'website'

export interface ProjectImage {
  src: string
  width: number
  height: number
}

export interface Project {
  id: ProjectId
  /** Nombre propio del cliente: no se traduce. */
  name: string
  status: ProjectStatus
  /** URL del sitio en vivo; null mientras el proyecto no este publicado. */
  url: string | null
  image: ProjectImage
  /** Se resuelve contra `portfolio.countries.<code>`. */
  country: CountryCode
  /** Emoji de bandera que acompana al chip de pais. */
  flag: string
  /** Se resuelve contra `portfolio.types.<type>`. */
  type: ProjectType
  /** Stack del proyecto. Nombres propios de tecnologias: no se traducen. */
  tech: readonly string[]
  /** Ruta de las traducciones (`.category`, `.desc`, `.cta`, `.alt`). */
  i18nKey: `portfolio.projects.${ProjectId}`
}

export const projects: readonly Project[] = [
  {
    id: 'zycor',
    name: 'Zycor Construction LLC',
    status: 'live',
    url: 'https://www.zycorconstruction.com/',
    image: {
      src: '/img/portfolio-zycor.webp',
      width: 640,
      height: 481,
    },
    country: 'us',
    flag: '\u{1F1FA}\u{1F1F8}',
    type: 'landing',
    tech: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Vercel'],
    i18nKey: 'portfolio.projects.zycor',
  },
  {
    id: 'wood',
    name: 'Wood Designs',
    status: 'coming-soon',
    url: null,
    image: {
      src: '/img/portfolio-wood.webp',
      width: 641,
      height: 480,
    },
    country: 'ar',
    flag: '\u{1F1E6}\u{1F1F7}',
    type: 'website',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    i18nKey: 'portfolio.projects.wood',
  },
]
