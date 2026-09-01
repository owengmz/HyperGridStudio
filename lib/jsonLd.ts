import { site } from '@/data/site'
import { priceRange } from '@/data/pricing'
import { absoluteUrl } from '@/lib/metadata'
import type { Locale } from '@/i18n/routing'

/**
 * Datos estructurados Schema.org.
 *
 * Reemplaza al bloque suelto de tipo ProfessionalService que tenia legacy por
 * un `@graph` con tres nodos enlazados por `@id`: Organization (la entidad),
 * WebSite (el sitio) y ProfessionalService (lo que se ofrece). Que esten
 * enlazados es lo que le permite a Google entender que hablan de lo mismo.
 *
 * Todo sale de data/, no hay literales duplicados: el `priceRange` es el de
 * data/pricing.ts, ya corregido a partir de los planes reales (el de legacy
 * decia "$150 - $500+" y el plan Tienda Online cuesta $800).
 */
export function buildJsonLd(options: {
  locale: Locale
  description: string
  /** Nombres traducidos de los tres pilares. */
  serviceTypes: readonly string[]
}) {
  const { locale, description, serviceTypes } = options

  const organizationId = `${site.url}/#organization`
  const websiteId = `${site.url}/#website`
  const serviceId = `${site.url}/#service`

  const address = {
    '@type': 'PostalAddress',
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.countryCode,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: site.name,
        url: site.url,
        email: site.email,
        logo: {
          '@type': 'ImageObject',
          url: new URL('/img/logo.webp', site.url).toString(),
          width: 210,
          height: 141,
        },
        address,
        sameAs: site.social.map((social) => social.url),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.url,
        name: site.name,
        publisher: { '@id': organizationId },
        inLanguage: ['es-AR', 'en'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': serviceId,
        name: site.name,
        description,
        url: absoluteUrl('/', locale),
        provider: { '@id': organizationId },
        isPartOf: { '@id': websiteId },
        priceRange,
        address,
        areaServed: ['Argentina', 'United States', 'España'],
        serviceType: [...serviceTypes],
      },
    ],
  }
}

/**
 * Nodo Service de una pagina de servicio.
 *
 * Se enlaza al Organization global por @id en vez de repetir los datos de la
 * empresa: Google entiende que el servicio lo presta la misma entidad que
 * declara el @graph del layout.
 */
export function buildServiceJsonLd(options: {
  serviceType: string
  description: string
  areaServed?: readonly string[]
}) {
  const { serviceType, description, areaServed = ['Argentina', 'United States'] } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: { '@id': `${site.url}/#organization` },
    areaServed: [...areaServed],
    description,
  }
}

/** Una pregunta de la seccion de preguntas frecuentes. */
export interface FaqEntry {
  q: string
  a: string
}

/**
 * Nodo FAQPage a partir del `faq[]` que ya vive en el namespace de cada pagina
 * de servicio. No duplica contenido: es el mismo texto que se renderiza.
 *
 * Es lo que Google usa para los resultados enriquecidos de preguntas. Solo
 * tiene sentido emitirlo si las preguntas estan visibles en la pagina, que es
 * el caso: ServicePageContent las renderiza como h3 + p.
 */
export function buildFaqJsonLd(faq: readonly FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.a,
      },
    })),
  }
}
