import type { MetadataRoute } from 'next'
import { routing, type AppPathname } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/metadata'

/**
 * Sitemap de las 20 URLs reales: las 10 rutas internas por cada uno de los dos
 * idiomas. Se deriva de i18n/routing.ts, asi que agregar una ruta alli la suma
 * aca sola.
 *
 * Reemplaza a legacy/public/sitemap.xml, que listaba una unica URL y ni
 * siquiera incluia la politica de privacidad.
 */

/** Hubs de pilar: por debajo de la home, por encima de las hijas. */
const HUBS: readonly AppPathname[] = [
  '/desarrollo-web',
  '/soluciones-de-software',
  '/automatizaciones',
]

function priorityFor(href: AppPathname): number {
  if (href === '/') return 1
  if (HUBS.includes(href)) return 0.9
  if (href === '/privacidad') return 0.3
  return 0.7
}

function changeFrequencyFor(href: AppPathname): 'monthly' | 'yearly' {
  return href === '/privacidad' ? 'yearly' : 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  /* Fecha del build: es lo mas cercano a "cuando cambio el contenido" sin un
     CMS que registre ediciones. */
  const lastModified = new Date()

  const paths = Object.keys(routing.pathnames) as AppPathname[]

  return paths.flatMap((href) => {
    /* Cada entrada declara sus alternates para que Google empareje los dos
       idiomas tambien desde el sitemap, no solo desde el <head>. */
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, absoluteUrl(href, locale)]),
    )

    return routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      lastModified,
      changeFrequency: changeFrequencyFor(href),
      priority: priorityFor(href),
      alternates: { languages },
    }))
  })
}
