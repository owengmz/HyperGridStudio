import type { AppPathname } from '@/i18n/routing'

/**
 * Estructura de navegacion.
 *
 * Header, menu movil y footer leen de aca para no repetir la lista (en legacy
 * estaba escrita cuatro veces, dos por documento HTML).
 */

/** Item que apunta a una seccion de la landing. */
export interface AnchorNavItem {
  /** Ancla dentro de la home, con el '#'. */
  hash: string
  /** Clave de messages/*.json con la etiqueta visible. */
  i18nKey: string
}

/** Item que apunta a una ruta propia, traducida por next-intl. */
export interface RouteNavItem {
  href: AppPathname
  i18nKey: string
}

export const mainNav: readonly AnchorNavItem[] = [
  { hash: '#about', i18nKey: 'nav.about' },
  { hash: '#portfolio', i18nKey: 'nav.portfolio' },
  { hash: '#pricing', i18nKey: 'nav.pricing' },
  { hash: '#contact', i18nKey: 'nav.contact' },
]

export const footerAnchors: readonly AnchorNavItem[] = [
  { hash: '#about', i18nKey: 'footer.about' },
  /* Apuntaba a #services, un ancla que no existe desde que Servicios se
     fusiono dentro de #about. En legacy el link no lleva a ningun lado. */
  { hash: '#about', i18nKey: 'footer.services' },
  { hash: '#portfolio', i18nKey: 'footer.portfolio' },
]

export const footerRoutes: readonly RouteNavItem[] = [
  { href: '/privacidad', i18nKey: 'footer.privacy' },
]

/**
 * Los tres pilares y sus subpaginas.
 *
 * Todavia no se muestran en el header ni en el footer: en esta etapa solo se
 * crearon las rutas. Cuando se decida como entran en el menu, y para armar el
 * sitemap, la jerarquia sale de aca.
 */
export interface Pillar {
  href: AppPathname
  i18nKey: string
  children: readonly RouteNavItem[]
}

export const pillars: readonly Pillar[] = [
  {
    href: '/desarrollo-web',
    i18nKey: 'pages.web.title',
    children: [{ href: '/desarrollo-web/tienda-online', i18nKey: 'pages.web_ecommerce.title' }],
  },
  {
    href: '/soluciones-de-software',
    i18nKey: 'pages.software.title',
    children: [
      { href: '/soluciones-de-software/punto-de-venta', i18nKey: 'pages.software_pos.title' },
      {
        href: '/soluciones-de-software/sistemas-de-gestion',
        i18nKey: 'pages.software_management.title',
      },
    ],
  },
  {
    href: '/automatizaciones',
    i18nKey: 'pages.automations.title',
    children: [
      { href: '/automatizaciones/reservas', i18nKey: 'pages.automations_booking.title' },
      { href: '/automatizaciones/whatsapp', i18nKey: 'pages.automations_whatsapp.title' },
    ],
  },
]
