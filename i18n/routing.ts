import { defineRouting } from 'next-intl/routing'

/**
 * Routing bilingue del sitio.
 *
 * `localePrefix: 'as-needed'` deja el espanol, que es el idioma por defecto,
 * en la raiz sin prefijo (`/desarrollo-web`) y prefija solo el ingles
 * (`/en/web-development`). Asi las URLs actuales que ya estan indexadas no
 * cambian.
 *
 * Las claves de `pathnames` son rutas internas: son las que se usan en el
 * arbol de app/ y en los <Link>. Los valores son el slug publico de cada
 * idioma. Como slug interno se eligio el espanol, para que el nombre de la
 * carpeta coincida con la URL del idioma por defecto.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',

  pathnames: {
    '/': '/',

    /* Pilar: Desarrollo Web */
    '/desarrollo-web': {
      es: '/desarrollo-web',
      en: '/web-development',
    },
    '/desarrollo-web/tienda-online': {
      es: '/desarrollo-web/tienda-online',
      en: '/web-development/ecommerce',
    },

    /* Pilar: Soluciones de Software */
    '/soluciones-de-software': {
      es: '/soluciones-de-software',
      en: '/software-solutions',
    },
    '/soluciones-de-software/punto-de-venta': {
      es: '/soluciones-de-software/punto-de-venta',
      en: '/software-solutions/point-of-sale',
    },
    '/soluciones-de-software/sistemas-de-gestion': {
      es: '/soluciones-de-software/sistemas-de-gestion',
      en: '/software-solutions/management-systems',
    },

    /* Pilar: Automatizaciones */
    '/automatizaciones': {
      es: '/automatizaciones',
      en: '/automations',
    },
    '/automatizaciones/reservas': {
      es: '/automatizaciones/reservas',
      en: '/automations/booking',
    },
    '/automatizaciones/whatsapp': {
      es: '/automatizaciones/whatsapp',
      en: '/automations/whatsapp',
    },

    /* Legal */
    '/privacidad': {
      es: '/privacidad',
      en: '/privacy',
    },
  },
})

export type Locale = (typeof routing.locales)[number]

/** Rutas internas validas: '/', '/desarrollo-web', etc. */
export type AppPathname = keyof typeof routing.pathnames
