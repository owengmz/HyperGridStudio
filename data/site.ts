/**
 * Informacion de negocio de Hyper Grid Studio.
 *
 * Fuente unica de verdad para datos NO traducibles: nombres propios, URLs,
 * numeros de contacto y metricas. Todo string traducible vive en messages/.
 *
 * Reemplaza la duplicacion del sitio legacy, donde el numero de WhatsApp
 * aparecia en 4 lugares y las redes sociales en 2 (markup + JSON-LD).
 */

export type SocialPlatform = 'instagram' | 'tiktok'

export interface SocialLink {
  platform: SocialPlatform
  /** Nombre propio de la plataforma: no se traduce. */
  label: string
  url: string
  /** Nombre del icono en Material Symbols Outlined. */
  icon: string
}

export interface BusinessAddress {
  locality: string
  region: string
  /** ISO 3166-1 alpha-2. */
  countryCode: string
  countryName: string
}

export interface GoogleReviews {
  url: string
  /** Se muestra tal cual en el badge del hero ("50+"). */
  count: string
  rating: number
}

export interface WhatsAppConfig {
  /** E.164 sin el '+' inicial: es el formato que exige wa.me. */
  number: string
  /** Formato legible para mostrar en pantalla. */
  display: string
  /**
   * Mensajes precargados en el chat, sin codificar (whatsappUrl() los encodea).
   * TODO(i18n): hoy solo existen en espanol; mover a messages/ si se decide
   * que el mensaje precargado acompane el idioma activo.
   */
  messages: {
    /** CTA del hero y de la seccion de contacto. */
    quote: string
    /** Boton flotante presente en todas las paginas. */
    floating: string
  }
}

/** Metricas del negocio que se muestran en el hero y en la seccion "Nosotros". */
export interface BusinessStats {
  /** Contadores animados del hero: el numero es el valor final del conteo. */
  hero: {
    projects: number
    deliveryDays: number
    rating: number
  }
  /** Valores ya formateados de la fila de stats de "Nosotros". */
  about: {
    yearsExperience: string
    projectsDelivered: string
    satisfaction: string
    support: string
  }
}

export interface SiteConfig {
  name: string
  /** Alt del logo. Es la marca escrita: no se traduce. */
  logoAlt: string
  url: string
  domain: string
  email: string
  whatsapp: WhatsAppConfig
  calendly: string
  address: BusinessAddress
  googleReviews: GoogleReviews
  social: readonly SocialLink[]
  stats: BusinessStats
  /** Locales soportados; el primero es el default. */
  locales: readonly ['es', 'en']
}

export const site: SiteConfig = {
  name: 'Hyper Grid Studio',
  logoAlt: 'HyperGrid.Studio',
  url: 'https://hypergridstudio.com',
  domain: 'hypergridstudio.com',
  email: 'owen.dev94@gmail.com',

  whatsapp: {
    number: '5492657501242',
    display: '+54 9 2657 50-1242',
    messages: {
      quote: 'Hola, vi tu landing y quiero cotizar mi web',
      floating: 'Hola, vi tu portafolio y me gustaria cotizar un proyecto web',
    },
  },

  calendly: 'https://calendly.com/owen-dev94/30min',

  address: {
    locality: 'San Luis',
    region: 'San Luis',
    countryCode: 'AR',
    countryName: 'Argentina',
  },

  googleReviews: {
    url: 'https://g.co/kgs/hypergridstudio',
    count: '50+',
    rating: 5.0,
  },

  social: [
    {
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/hypergrid.studio',
      icon: 'camera',
    },
    {
      platform: 'tiktok',
      label: 'TikTok',
      url: 'https://www.tiktok.com/@hypergrid.studio',
      icon: 'video_library',
    },
  ],

  stats: {
    hero: {
      projects: 48,
      deliveryDays: 10,
      rating: 5,
    },
    about: {
      yearsExperience: '2+',
      projectsDelivered: '48+',
      satisfaction: '100%',
      support: '24/7',
    },
  },

  locales: ['es', 'en'],
}

/**
 * Construye un enlace wa.me con el mensaje ya codificado.
 * Centraliza lo que en legacy/ estaba escrito a mano en 4 lugares distintos.
 */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Enlace mailto al correo de contacto. */
export function mailtoUrl(subject?: string): string {
  const base = `mailto:${site.email}`
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base
}
