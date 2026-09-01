import type { ReactNode } from 'react'
import Image from 'next/image'
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
 *   sections:         [{ heading, body?, outro?, links?, items_heading?,
 *                        items?, images? }]
 *   faq_heading:      string
 *   faq:              [{ q, a }]              -> se renderiza y emite FAQPage
 *   cta:              { heading, body, button } -> opcional, bloque de cierre
 *   schema:           { serviceType, description } -> emite el nodo Service
 *
 * `hero_cta`, `whatsapp_message`, `cta`, `schema`, `faq` y el `outro`, los
 * `items`, los `links` y las `images` de cada seccion son opcionales: si el
 * namespace no los trae, no se renderiza ni se emite nada. Sin
 * `whatsapp_message` los botones caen al mensaje default de data/site.ts.
 *
 * En `body` y en `outro` se pueden usar los tags de rich text globales
 * (<accent>, <mail>) mas <link1>…</link1>, <link2>…</link2>, etc. Cada <linkN>
 * toma su destino de `links[N-1]`, que es una ruta INTERNA de i18n/routing.ts
 * —la misma cadena en los dos idiomas—, opcionalmente con un ancla:
 * '/#portfolio'.
 */

/**
 * Medidas intrinsecas que se esperan de una captura.
 *
 * La columna de texto mide 760px, asi que 1600x900 cubre el ancho completo a
 * 2x y de sobra las dos columnas del grid. Fijarlas aca en vez de pedirlas por
 * imagen mantiene el grid parejo y evita que messages/ cargue con datos de
 * layout: ahi solo va copy.
 */
const IMAGE_WIDTH = 1600
const IMAGE_HEIGHT = 900

/**
 * Captura que acompana a una seccion.
 *
 * El `alt` vive en messages/ junto al resto del copy: es texto que lee un
 * lector de pantalla y cambia con el idioma, no un dato de layout.
 *
 * Un `src` vacio es la forma de dejar el alt escrito antes de tener el
 * archivo: la imagen no se renderiza hasta que la ruta este completa, asi no
 * se publica un 404 mientras tanto.
 */
interface ServiceImage {
  /** Ruta bajo /public, por ejemplo '/img/mipost-ventas.webp'. */
  src: string
  alt: string
}

interface ServiceSection {
  heading: string
  /** Opcional: una seccion puede ser solo un titulo con su lista. */
  body?: string
  links?: string[]
  items_heading?: string
  items?: string[]
  images?: ServiceImage[]
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

/**
 * Capturas de una seccion, en un grid que se acomoda solo: una imagen ocupa
 * el ancho de la columna y dos van a la par, apilandose en pantallas chicas.
 *
 * `aboveTheFold` solo es cierto en la primera seccion, la unica que puede
 * entrar en pantalla sin scrollear. Ahi la imagen va con `priority` (preload
 * con fetchpriority alto, igual que el LCP del hero); en el resto, `lazy`.
 */
function SectionImages({
  images,
  aboveTheFold,
}: {
  images: ServiceImage[]
  aboveTheFold: boolean
}) {
  /* Con dos imagenes cada una ocupa media columna; con una, la columna entera. */
  const sizes =
    images.length > 1 ? '(max-width: 800px) 92vw, 372px' : '(max-width: 800px) 92vw, 760px'

  return (
    <div className="service-images">
      {images.map((image) => (
        <Image
          key={image.src}
          className="service-image"
          src={image.src}
          alt={image.alt}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          sizes={sizes}
          {...(aboveTheFold ? { priority: true } : { loading: 'lazy' as const })}
        />
      ))}
    </div>
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
              /* Se descartan las que todavia no tienen archivo: el alt puede
                 estar escrito antes que la captura exista. */
              const images = (section.images ?? []).filter((image) => image.src)

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

                  {/* Van antes del outro: el parrafo de cierre suele llevar el
                      enlace a la pagina siguiente y conviene que quede ultimo. */}
                  {images.length > 0 && (
                    <SectionImages images={images} aboveTheFold={index === 0} />
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
