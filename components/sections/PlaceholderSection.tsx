import { useTranslations } from 'next-intl'
import { pillars } from '@/data/navigation'
import { site, whatsappUrl } from '@/data/site'
import { Link } from '@/i18n/navigation'
import type { AppPathname } from '@/i18n/routing'
import { WhatsAppIcon } from '@/components/ui/icons'

interface PlaceholderSectionProps {
  /** Ruta interna de la pagina; se usa para listar sus hijas si es un hub. */
  href: AppPathname
  title: string
  description: string
}

/**
 * Cuerpo provisional de las paginas de pilares y sus hijas.
 *
 * La Etapa 1d solo levanto el esqueleto de rutas: el copy definitivo llega en
 * la etapa de contenido. Reutiliza las clases .legal del CSS existente, que ya
 * compensan la altura del header fijo, para no agregar estilos nuevos.
 */
export function PlaceholderSection({ href, title, description }: PlaceholderSectionProps) {
  const t = useTranslations()

  /* Si la pagina es un hub, enlaza a sus subpaginas: asi cada hija tiene un
     enlace desde su propia seccion y no depende solo del menu del header. */
  const children = pillars.find((pillar) => pillar.href === href)?.children ?? []

  return (
    <main className="legal" id="main-content">
      <div className="container">
        <div className="legal-card reveal-up">
          <Link className="legal-back" href="/">
            &larr; <span>{t('placeholder.back')}</span>
          </Link>

          <span className="section-tag">{t('placeholder.badge')}</span>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-intro">{description}</p>

          <div className="legal-body">
            <p>{t('placeholder.body')}</p>

            {children.length > 0 && (
              <ul className="portfolio-tags" aria-label={title}>
                {children.map((child) => (
                  <li key={child.href} className="portfolio-tag">
                    <Link href={child.href}>{t(child.i18nKey)}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="contact-actions">
            <a
              className="btn btn-primary btn-lg magnetic"
              href={whatsappUrl(site.whatsapp.messages.quote)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              {t('placeholder.cta')}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
