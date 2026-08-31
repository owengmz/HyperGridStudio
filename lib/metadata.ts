import { site } from '@/data/site'
import { getPathname } from '@/i18n/navigation'
import { routing, type AppPathname, type Locale } from '@/i18n/routing'

/** URL absoluta de una ruta interna en un locale dado. */
export function absoluteUrl(href: AppPathname, locale: Locale): string {
  return new URL(getPathname({ href, locale }), site.url).toString()
}

/**
 * Bloque `alternates` de la Metadata API.
 *
 * Emite el canonical del idioma actual y un hreflang por locale, mas
 * `x-default` apuntando al idioma por defecto (espanol). Google usa estos
 * pares para no tratar las dos versiones como contenido duplicado.
 */
export function buildAlternates(href: AppPathname, locale: Locale) {
  const languages = Object.fromEntries(
    routing.locales.map((code) => [code, absoluteUrl(href, code)]),
  ) as Record<Locale, string>

  return {
    canonical: absoluteUrl(href, locale),
    languages: {
      ...languages,
      'x-default': absoluteUrl(href, routing.defaultLocale),
    },
  }
}

/**
 * Metadata de una pagina interior.
 *
 * El title sale sin sufijo: el template `%s | Hyper Grid Studio` definido en
 * el layout del locale se lo agrega.
 */
export function buildPageMetadata(options: {
  href: AppPathname
  locale: Locale
  title: string
  description: string
}) {
  const { href, locale, title, description } = options

  return {
    title,
    description,
    alternates: buildAlternates(href, locale),
  }
}
