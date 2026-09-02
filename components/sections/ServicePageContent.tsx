import type { ComponentType, ReactNode } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { site, whatsappUrl } from '@/data/site'
import { getPinsForImage, type CasePin } from '@/data/caseStudies'
import { Link, getPathname } from '@/i18n/navigation'
import type { AppPathname, Locale } from '@/i18n/routing'
import { richTags } from '@/lib/i18n'
import { buildFaqJsonLd, buildServiceJsonLd, type FaqEntry } from '@/lib/jsonLd'
import { WhatsAppIcon } from '@/components/ui/icons'

/**
 * Props de la figura anotada, sin importar el componente que las implementa.
 *
 * Es la misma forma que expone PinnedFigure. Se declara aca para que este
 * modulo pueda tipar la inyeccion sin `import`ar el componente: un `import
 * type` desapareceria en compilacion, pero cualquier import del modulo real
 * —aunque solo se use el tipo— es facil de convertir en import de valor sin
 * darse cuenta, y eso volveria a meter el chunk en las ocho paginas.
 */
export interface CaseFigureProps {
  src: string
  alt: string
  pins: readonly CasePin[]
  labels: readonly string[]
  sizes?: string
  priority?: boolean
}

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
 *   title:            string                  -> etiqueta corta; va al riel
 *   h1:               string
 *   intro:            string
 *   hero_cta:         string                  -> opcional, boton a WhatsApp
 *   whatsapp_message: string                  -> opcional, mensaje precargado
 *   sections:         [{ heading, body?, outro?, links?, items_heading?,
 *                        items?, spec?, images? }]
 *   faq_heading:      string
 *   faq:              [{ q, a }]              -> se renderiza y emite FAQPage
 *   cta:              { heading, body, button } -> opcional, bloque de cierre
 *   schema:           { serviceType, description } -> emite el nodo Service
 *
 * `hero_cta`, `whatsapp_message`, `cta`, `schema`, `faq` y el `outro`, los
 * `items`, los `links`, el `spec` y las `images` de cada seccion son
 * opcionales: si el namespace no los trae, no se renderiza ni se emite nada.
 * Sin `whatsapp_message` los botones caen al mensaje default de data/site.ts.
 *
 * En `body` y en `outro` se pueden usar los tags de rich text globales
 * (<accent>, <mail>) mas <link1>…</link1>, <link2>…</link2>, etc. Cada <linkN>
 * toma su destino de `links[N-1]`, que es una ruta INTERNA de i18n/routing.ts
 * —la misma cadena en los dos idiomas—, opcionalmente con un ancla:
 * '/#portfolio'.
 *
 * ── Layout (Etapa 3) ──
 *
 * La pagina es una pila de bloques y cada bloque es la misma grilla de dos
 * columnas: el riel (`--rail`) y la columna de texto (`--measure`). El riel es
 * el margen izquierdo donde vive la capa de instrumento —indices, etiquetas—,
 * y es lo que hace que la mancha de texto quede corrida a la derecha del
 * centro optico en vez de centrada.
 *
 * Cada bloque arma su propia grilla en vez de que la arme el contenedor: asi
 * los <section> siguen siendo un elemento por bloque y no hay que aplanar el
 * arbol en celdas sueltas para que la grilla las vea.
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
 * archivo. Antes eso hacia que la imagen no se renderizara y punto; ahora, en
 * el panel de caso de estudio, deja en su lugar un recuadro punteado del mismo
 * tamanio (ver StagePlaceholder), para que la composicion no se desarme
 * mientras falten los archivos.
 */
interface ServiceImage {
  /** Ruta bajo /public, por ejemplo '/img/mipost-ventas.webp'. */
  src: string
  alt: string
}

/** Fila de la ficha tecnica: un dato duro con su etiqueta. */
interface ServiceSpecItem {
  label: string
  value: string
}

interface ServiceSection {
  heading: string
  /** Opcional: una seccion puede ser solo un titulo con su lista. */
  body?: string
  links?: string[]
  items_heading?: string
  items?: string[]
  /** Ficha tecnica. Su presencia es lo que convierte la seccion en un caso. */
  spec?: ServiceSpecItem[]
  images?: ServiceImage[]
  outro?: string
}

interface ServicePageContentProps {
  /** Ruta del namespace en messages/, por ejemplo 'pages.software_pos'. */
  namespace: string
  /** Paises del nodo Service. Por defecto Argentina y Estados Unidos. */
  areaServed?: readonly string[]
  /**
   * Componente con el que se dibujan las capturas del caso de estudio.
   *
   * Se inyecta desde la pagina en vez de importarse aca a proposito. Este
   * modulo lo comparten las ocho paginas de servicio, asi que todo lo que
   * importe entra en el JS de las ocho, se llegue a renderizar o no: con el
   * import estatico, siete paginas sin caso de estudio cargaban igual el chunk
   * de PinnedFigure. Dejandolo como prop, el unico modulo que lo nombra es el
   * de Punto de Venta, y el bundler lo saca del grafo de las demas.
   *
   * `next/dynamic` no servia para esto: al mantener el SSR —que hace falta,
   * porque la figura trae el <Image> del caso y tiene que estar en el HTML— el
   * componente sigue en el manifest de la ruta, y encima suma el runtime de
   * React.lazy. Medido, dejaba las ocho paginas mas pesadas que con el import
   * estatico.
   *
   * Sin esta prop el caso de estudio muestra la captura sin pines, que es lo
   * correcto para una pagina que tenga ficha tecnica pero no anotaciones.
   */
  caseFigure?: ComponentType<CaseFigureProps>
}

/**
 * Compara el titulo de la lista con el de la seccion.
 *
 * Varias paginas livianas repiten el mismo texto en los dos ('Que incluye'
 * como h2 y 'Que incluye:' como h3), y quedaban uno debajo del otro. Se
 * ignoran los dos puntos finales y las mayusculas para que 'Que incluye:'
 * cuente como repetido, pero 'Que incluye (segun tu catalogo):' no: ese si
 * agrega informacion y se sigue mostrando.
 */
function repeatsHeading(itemsHeading: string, heading: string) {
  const normalize = (value: string) => value.trim().replace(/:$/, '').toLocaleLowerCase()

  return normalize(itemsHeading) === normalize(heading)
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
 * Celda del riel.
 *
 * Va `aria-hidden` porque su contenido es una marca de posicion: el indice
 * repite el orden que el lector de pantalla ya obtiene recorriendo la pagina,
 * y la etiqueta repite el nombre de la pagina. Nada de eso agrega informacion
 * en lectura lineal, y leerlo antes de cada titulo seria ruido.
 *
 * El riel se renderiza igual cuando esta vacio: es lo que sostiene la columna
 * y sin el la grilla colapsaria a una sola.
 */
function Rail({ children }: { children?: ReactNode }) {
  return (
    <div className="rail" aria-hidden="true">
      {children}
      <span className="rail-rule" />
    </div>
  )
}

/**
 * Ficha tecnica: los datos duros de un caso, en la capa de instrumento.
 *
 * Es una <dl> y no una tabla ni una lista de <p>: cada fila es exactamente un
 * par termino/definicion, que es lo que una <dl> describe. Los lectores de
 * pantalla anuncian el par completo; en una tabla de dos columnas habria que
 * cablear encabezados para conseguir lo mismo.
 */
function SpecSheet({ items }: { items: ServiceSpecItem[] }) {
  return (
    <dl className="spec-sheet">
      {items.map((item) => (
        <div className="spec-row" key={item.label}>
          <dt className="spec-label">{item.label}</dt>
          <dd className="spec-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Hueco de una captura que todavia no existe.
 *
 * Mantiene la caja con la misma relacion de aspecto que tendra la imagen, asi
 * el panel del caso ya se ve con su composicion final y no se recompagina el
 * dia que se suban los archivos. Adentro va el `alt`, que ya esta escrito:
 * dice que va a mostrar esa captura sin inventar un texto de relleno.
 *
 * `aria-hidden`: no hay contenido todavia: anunciar 'panel de ventas de
 * miPost' sin panel deja al lector de pantalla esperando algo que no esta.
 */
function StagePlaceholder({ label }: { label: string }) {
  return (
    <div className="stage-placeholder" aria-hidden="true">
      <span className="stage-placeholder-label">{label}</span>
    </div>
  )
}

/**
 * Capturas de una seccion comun, en un grid que se acomoda solo: una imagen
 * ocupa el ancho de la columna y dos van a la par, apilandose en pantallas
 * chicas.
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

/**
 * Escenario de capturas de un caso de estudio.
 *
 * Cada slot resuelve solo: con archivo va PinnedFigure —que suma la capa de
 * pines si data/caseStudies.ts tiene coordenadas para ese `src`, y si no
 * dibuja la captura sola—, y sin archivo queda el recuadro punteado. Los dos
 * ocupan la misma caja, asi que el panel no cambia de forma segun cuantas
 * capturas esten cargadas.
 */
function CaseStage({
  images,
  figure: Figure,
}: {
  images: ServiceImage[]
  figure?: ComponentType<CaseFigureProps>
}) {
  const sizes = images.length > 1 ? '(max-width: 900px) 92vw, 372px' : '(max-width: 900px) 92vw, 760px'

  return (
    <div className="case-stage">
      {images.map((image) => (
        <div className="case-stage-slot" key={image.src || image.alt}>
          {!image.src ? (
            <StagePlaceholder label={image.alt} />
          ) : Figure ? (
            <Figure
              src={image.src}
              alt={image.alt}
              pins={getPinsForImage(image.src)}
              labels={[]}
              sizes={sizes}
            />
          ) : (
            /* Sin figura inyectada: la captura sola, sin capa de pines. */
            <Image
              className="service-image"
              src={image.src}
              alt={image.alt}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              sizes={sizes}
              loading="lazy"
            />
          )}
        </div>
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

export function ServicePageContent({
  namespace,
  areaServed,
  caseFigure,
}: ServicePageContentProps) {
  const t = useTranslations(namespace)

  const sections = t.raw('sections') as ServiceSection[]
  const faq = t.has('faq') ? (t.raw('faq') as FaqEntry[]) : []

  /*
    El indice numerado solo tiene sentido si hay una secuencia que contar. Con
    una sola seccion —las tres paginas de Automatizaciones— un '01' suelto no
    ordena nada, asi que el riel lleva la etiqueta corta de la pagina.
  */
  const isSequence = sections.length > 1
  const railLabel = t('title')

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
            <header className="service-block service-page-header reveal-up">
              <Rail />

              <div className="block-body">
                <h1 className="service-page-title">{t('h1')}</h1>
                <p className="service-page-intro">{t('intro')}</p>

                {t.has('hero_cta') && (
                  <div className="service-page-actions">
                    <WhatsAppCta label={t('hero_cta')} message={whatsappMessage} />
                  </div>
                )}
              </div>
            </header>

            {sections.map((section, index) => {
              /* Un caso de estudio es una seccion con ficha tecnica: es el dato
                 que lo distingue de una seccion de texto con capturas. */
              const isCase = Boolean(section.spec?.length)

              /* Fuera del panel de caso se siguen descartando las capturas sin
                 archivo. Adentro no: ahi el hueco lo ocupa el placeholder. */
              const images = section.images ?? []
              const readyImages = images.filter((image) => image.src)

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
                <section
                  className={`service-block service-section reveal-up${isCase ? ' is-case' : ''}`}
                  key={section.heading}
                >
                  <Rail>
                    {isSequence ? (
                      /* Ordinal de dos digitos: el ancho no salta del 9 al 10. */
                      <span className="rail-index">{String(index + 1).padStart(2, '0')}</span>
                    ) : (
                      <span className="rail-label">{railLabel}</span>
                    )}
                  </Rail>

                  <div className="block-body">
                    <h2>{section.heading}</h2>

                    {section.body && <p>{t.rich(`sections.${index}.body`, tags)}</p>}

                    {section.items_heading &&
                      !repeatsHeading(section.items_heading, section.heading) && (
                        <h3>{section.items_heading}</h3>
                      )}

                    {section.items && (
                      <ul className="service-list">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {/* Ficha tecnica: va despues de la lista, como cierre de
                        datos duros del caso. */}
                    {section.spec && section.spec.length > 0 && (
                      <SpecSheet items={section.spec} />
                    )}

                    {/* Van antes del outro: el parrafo de cierre suele llevar el
                        enlace a la pagina siguiente y conviene que quede ultimo. */}
                    {isCase
                      ? images.length > 0 && <CaseStage images={images} figure={caseFigure} />
                      : readyImages.length > 0 && (
                          <SectionImages images={readyImages} aboveTheFold={index === 0} />
                        )}

                    {/* Parrafo de cierre, despues de la lista si la seccion tiene una. */}
                    {section.outro && <p>{t.rich(`sections.${index}.outro`, tags)}</p>}
                  </div>
                </section>
              )
            })}

            {faq.length > 0 && (
              <section className="service-block service-faq reveal-up">
                {/*
                  El titulo del FAQ se promueve al riel: deja de ser un h2 de
                  cuerpo al pie de la pagina y pasa a ser la etiqueta del
                  bloque, con las preguntas ocupando la columna entera a dos
                  columnas. Sigue siendo un h2 real, solo que su tratamiento
                  visual es el del riel — por eso este riel no va aria-hidden.
                */}
                <div className="rail">
                  <h2 className="rail-label">{t('faq_heading')}</h2>
                  <span className="rail-rule" aria-hidden="true" />
                </div>

                <div className="block-body">
                  <div className="faq-grid">
                    {faq.map((item) => (
                      <div className="service-faq-item" key={item.q}>
                        <h3>{item.q}</h3>
                        <p>{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {t.has('cta.heading') && (
              /* El cierre rompe la grilla a proposito: ocupa riel + columna.
                 Es la senal de que la secuencia de bloques termino. */
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
