import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { site, whatsappUrl } from '@/data/site'
import { Link, getPathname } from '@/i18n/navigation'
import type { AppPathname, Locale } from '@/i18n/routing'
import { richTags } from '@/lib/i18n'
import { buildFaqJsonLd, buildServiceJsonLd, type FaqEntry } from '@/lib/jsonLd'
import { WhatsAppIcon } from '@/components/ui/icons'

/**
 * Cuerpo de una pagina de servicio.
 *
 * Se alimenta entero de un namespace de messages/, asi que las paginas que
 * faltan solo necesitan sumar sus mensajes: no hace falta un componente nuevo
 * por pagina, ni recordar de cablear el JSON-LD.
 *
 * Forma esperada del namespace:
 *
 *   meta:             { title, description }  -> lo consume generateMetadata
 *   h1:               string
 *   intro:            string
 *   hero_cta:         string                  -> opcional, boton a WhatsApp
 *   whatsapp_message: string                  -> opcional, mensaje precargado
 *   sections:         [{ heading, body?, outro?, links?, items_heading?, items? }]
 *   faq_heading:      string
 *   faq:              [{ q, a }]              -> se renderiza y emite FAQPage
 *   cta:              { heading, body, button } -> opcional, bloque de cierre
 *   schema:           { serviceType, description } -> emite el nodo Service
 *
 * `hero_cta`, `whatsapp_message`, `cta`, `schema`, `faq` y el `outro`, los
 * `items` y los `links` de cada seccion son opcionales: si el namespace no los
 * trae, no se renderiza ni se emite nada. Sin `whatsapp_message` los botones
 * caen al mensaje default de data/site.ts.
 *
 * En `body` y en `outro` se pueden usar los tags de rich text globales
 * (<accent>, <mail>) mas <link1>…</link1>, <link2>…</link2>, etc. Cada <linkN>
 * toma su destino de `links[N-1]`, que es una ruta INTERNA de i18n/routing.ts
 * —la misma cadena en los dos idiomas—, opcionalmente con un ancla:
 * '/#portfolio'.
 */

interface ServiceSection {
  heading: string
  /** Opcional: una seccion puede ser solo un titulo con su lista. */
  body?: string
  links?: string[]
  items_heading?: string
  items?: string[]
  outro?: string
}

interface ServicePageContentProps {
  /** Ruta del namespace en messages/, por ejemplo 'pages.software_pos'. */
  namespace: string
  /** Paises del nodo Service. Por defecto Argentina y Estados Unidos. */
  areaServed?: readonly string[]
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

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Boton a WhatsApp con el mensaje ya precargado. */
function WhatsAppCta({ label, message }: { label: string; message: string }) {
  return (
    <a
      className="btn btn-primary btn-lg magnetic"
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon />
      {label}
    </a>
  )
}

export function ServicePageContent({ namespace, areaServed }: ServicePageContentProps) {
  const t = useTranslations(namespace)

  const sections = t.raw('sections') as ServiceSection[]
  const faq = t.has('faq') ? (t.raw('faq') as FaqEntry[]) : []

  /* Mensaje propio de la pagina si el namespace lo define; si no, el default
     del sitio, que es el que siguen usando las paginas sin uno propio. */
  const whatsappMessage = t.has('whatsapp_message')
    ? t('whatsapp_message')
    : site.whatsapp.messages.quote

  /* Nodo Service, ligado al Organization global por @id. */
  const serviceJsonLd = t.has('schema.serviceType')
    ? buildServiceJsonLd({
        serviceType: t('schema.serviceType'),
        description: t('schema.description'),
        areaServed,
      })
    : null

  /* FAQPage con las mismas preguntas que se renderizan mas abajo. */
  const faqJsonLd = faq.length > 0 ? buildFaqJsonLd(faq) : null

  return (
    <>
      {serviceJsonLd && <JsonLd data={serviceJsonLd} />}
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <main className="service-page" id="main-content">
        <div className="container">
          <article className="service-page-inner">
            <header className="service-page-header reveal-up">
              <h1 className="service-page-title">{t('h1')}</h1>
              <p className="service-page-intro">{t('intro')}</p>

              {t.has('hero_cta') && (
                <div className="service-page-actions">
                  <WhatsAppCta label={t('hero_cta')} message={whatsappMessage} />
                </div>
              )}
            </header>

            {sections.map((section, index) => {
              /* Un handler por cada <linkN> declarado en `links`. Vale tanto
                 para `body` como para `outro`. */
              const tags = {
                ...richTags,
                ...Object.fromEntries(
                  (section.links ?? []).map((href, linkIndex) => [
                    `link${linkIndex + 1}`,
                    (chunks: ReactNode) => <ContentLink href={href}>{chunks}</ContentLink>,
                  ]),
                ),
              }

              return (
                <section className="service-section reveal-up" key={section.heading}>
                  <h2>{section.heading}</h2>

                  {section.body && <p>{t.rich(`sections.${index}.body`, tags)}</p>}

                  {section.items_heading && <h3>{section.items_heading}</h3>}

                  {section.items && (
                    <ul className="service-list">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Parrafo de cierre, despues de la lista si la seccion tiene una. */}
                  {section.outro && <p>{t.rich(`sections.${index}.outro`, tags)}</p>}
                </section>
              )
            })}

            {faq.length > 0 && (
              <section className="service-faq reveal-up">
                <h2>{t('faq_heading')}</h2>

                {faq.map((item) => (
                  <div className="service-faq-item" key={item.q}>
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </section>
            )}

            {t.has('cta.heading') && (
              <section className="service-cta reveal-up">
                <h2>{t('cta.heading')}</h2>
                <p>{t('cta.body')}</p>
                <div className="service-page-actions">
                  <WhatsAppCta label={t('cta.button')} message={whatsappMessage} />
                </div>
              </section>
            )}
          </article>
        </div>
      </main>
    </>
  )
}
