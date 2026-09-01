import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, getPathname } from '@/i18n/navigation'
import type { AppPathname, Locale } from '@/i18n/routing'
import { richTags } from '@/lib/i18n'

/**
 * Cuerpo de una pagina de servicio.
 *
 * Se alimenta entero de un namespace de messages/, asi que las paginas que
 * faltan (los 3 hubs y las 5 subpaginas restantes) solo necesitan sumar sus
 * mensajes: no hace falta un componente nuevo por pagina.
 *
 * Forma esperada del namespace:
 *
 *   meta:        { title, description }   -> lo consume generateMetadata
 *   h1:          string
 *   intro:       string
 *   sections:    [{ heading, body, links? }]
 *   faq_heading: string
 *   faq:         [{ q, a }]
 *   schema:      { serviceType, description }  -> lo consume el JSON-LD
 *
 * En `body` se pueden usar los tags de rich text globales (<accent>, <mail>)
 * mas <link1>…</link1>, <link2>…</link2>, etc. Cada <linkN> toma su destino de
 * `links[N-1]`, que es una ruta INTERNA de i18n/routing.ts —la misma cadena en
 * los dos idiomas—, opcionalmente con un ancla: '/#portfolio'.
 */

interface ServiceSection {
  heading: string
  body: string
  links?: string[]
}

interface ServiceFaqItem {
  q: string
  a: string
}

interface ServicePageContentProps {
  /** Ruta del namespace en messages/, por ejemplo 'pages.software_pos'. */
  namespace: string
}

/**
 * Enlace interno de un cuerpo de texto.
 *
 * Si el destino trae ancla se emite un <a> con la URL ya localizada, porque el
 * <Link> tipado de next-intl solo acepta rutas internas sin fragmento.
 */
function ContentLink({ href, children }: { href: string; children: ReactNode }) {
  const locale = useLocale() as Locale
  const [rawPath, hash] = href.split('#')
  const pathname = (rawPath || '/') as AppPathname

  if (hash) {
    return <a href={`${getPathname({ href: pathname, locale })}#${hash}`}>{children}</a>
  }

  return <Link href={pathname}>{children}</Link>
}

export function ServicePageContent({ namespace }: ServicePageContentProps) {
  const t = useTranslations(namespace)

  const sections = t.raw('sections') as ServiceSection[]
  const faq = t.raw('faq') as ServiceFaqItem[]

  return (
    <main className="service-page" id="main-content">
      <div className="container">
        <article className="service-page-inner">
          <header className="service-page-header reveal-up">
            <h1 className="service-page-title">{t('h1')}</h1>
            <p className="service-page-intro">{t('intro')}</p>
          </header>

          {sections.map((section, index) => (
            <section className="service-section reveal-up" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>
                {t.rich(`sections.${index}.body`, {
                  ...richTags,
                  /* Un handler por cada <linkN> declarado en `links`. */
                  ...Object.fromEntries(
                    (section.links ?? []).map((href, linkIndex) => [
                      `link${linkIndex + 1}`,
                      (chunks: ReactNode) => <ContentLink href={href}>{chunks}</ContentLink>,
                    ]),
                  ),
                })}
              </p>
            </section>
          ))}

          <section className="service-faq reveal-up">
            <h2>{t('faq_heading')}</h2>

            {faq.map((item) => (
              <div className="service-faq-item" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </section>
        </article>
      </div>
    </main>
  )
}
