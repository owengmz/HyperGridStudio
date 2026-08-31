import { useTranslations } from 'next-intl'
import { site, whatsappUrl } from '@/data/site'
import { richTags } from '@/lib/i18n'
import { MaterialIcon, WhatsAppIcon } from '@/components/ui/icons'

/**
 * Contacto: solo CTAs, sin formulario (se quito del markup hace varios commits).
 *
 * Los textos ahora salen de messages/, con la copy que hoy esta en produccion.
 * En legacy estaban escritos a mano en el HTML y eran la unica seccion que no
 * cambiaba al pasar a ingles.
 */
export function Contact() {
  const t = useTranslations('contact')

  return (
    <section className="contact" id="contact" aria-label="Contacto">
      <div className="container">
        <div className="contact-hero reveal-up">
          <div className="section-tag">{t('tag')}</div>

          <h2 className="contact-headline">{t.rich('title', richTags)}</h2>

          <p className="contact-sub">{t('desc')}</p>

          <div className="contact-actions">
            <a
              className="btn btn-primary btn-lg magnetic"
              href={whatsappUrl(site.whatsapp.messages.quote)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('cta_whatsapp_aria')}
            >
              <WhatsAppIcon />
              {t('cta_whatsapp')}
            </a>

            <a
              className="btn btn-ghost btn-lg"
              href={site.calendly}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cta_calendly')}
            </a>
          </div>

          <div className="contact-meta">
            <div className="social-links">
              {site.social.map((social) => (
                <a
                  key={social.platform}
                  className="social-btn"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} de ${site.name}`}
                >
                  <MaterialIcon name={social.icon} />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
