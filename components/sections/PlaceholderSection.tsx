import { useTranslations } from 'next-intl'
import { site, whatsappUrl } from '@/data/site'
import { Link } from '@/i18n/navigation'
import { WhatsAppIcon } from '@/components/ui/icons'

interface PlaceholderSectionProps {
  title: string
  description: string
}

/**
 * Cuerpo provisional de las paginas de pilares y sus hijas.
 *
 * La Etapa 1d solo levanta el esqueleto de rutas: el copy definitivo llega en
 * la etapa de contenido. Reutiliza las clases .legal del CSS existente, que ya
 * compensan la altura del header fijo, para no agregar estilos nuevos.
 */
export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  const t = useTranslations('placeholder')

  return (
    <main className="legal" id="main-content">
      <div className="container">
        <div className="legal-card reveal-up">
          <Link className="legal-back" href="/">
            &larr; <span>{t('back')}</span>
          </Link>

          <span className="section-tag">{t('badge')}</span>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-intro">{description}</p>

          <div className="legal-body">
            <p>{t('body')}</p>
          </div>

          <div className="contact-actions">
            <a
              className="btn btn-primary btn-lg magnetic"
              href={whatsappUrl(site.whatsapp.messages.quote)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
