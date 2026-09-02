import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { site, whatsappUrl } from '@/data/site'
import { richTags } from '@/lib/i18n'
import { StatCounter } from '@/components/ui/StatCounter'
import { MaterialIcon, WhatsAppIcon } from '@/components/ui/icons'

export function Hero() {
  const t = useTranslations('hero')
  const { hero } = site.stats

  return (
    <section className="hero" id="hero" aria-label="Presentacion principal">
      <div className="hero-glow hero-glow-1" aria-hidden="true" />
      <div className="hero-glow hero-glow-2" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-content reveal-up">
          <div className="hero-badges">
            <div className="badge">
              <span className="badge-dot" aria-hidden="true" />
              <span>{t('badge_available')}</span>
            </div>

            <a
              className="badge badge-reviews"
              href={site.googleReviews.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('badge_reviews_aria')}
            >
              <span className="badge-stars" aria-hidden="true">
                ★★★★★
              </span>
              <span>{t('badge_reviews')}</span>
            </a>
          </div>

          <h1 className="hero-title">
            <span>{t('title_line1')}</span>
            <br />
            <span className="hero-title-accent">{t.rich('title_accent', richTags)}</span>
          </h1>

          <p className="hero-desc">{t('desc')}</p>

          <div className="hero-actions">
            <a className="btn btn-primary btn-lg magnetic" href="#portfolio">
              {t('cta_primary')}
            </a>

            {/*
              Mismo tratamiento que el CTA de WhatsApp de las 8 paginas de
              servicio: la accion es la misma, asi que el boton es el mismo.
              Antes era verde con texto blanco (1.98:1, no llegaba a AA).
            */}
            <a
              className="btn btn-primary btn-lg"
              href={whatsappUrl(site.whatsapp.messages.quote)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('cta_whatsapp')}
            >
              <WhatsAppIcon />
              <span>{t('cta_whatsapp')}</span>
            </a>
          </div>

          <div className="hero-stats" role="list" aria-label="Estadisticas">
            <StatCounter target={hero.projects} suffix="+" label={t('stat_projects')} />
            <div className="stat-divider" aria-hidden="true" />
            <StatCounter
              target={hero.deliveryDays}
              suffix={t('stat_delivery_suffix')}
              label={t('stat_delivery_label')}
            />
            <div className="stat-divider" aria-hidden="true" />
            <StatCounter target={hero.rating} suffix="★" label={t('stat_rating')} />
          </div>
        </div>

        <div className="hero-visual reveal-right">
          <div className="hero-card-wrapper">
            <div className="hero-card">
              <div className="hero-card-glow" aria-hidden="true" />
              {/*
                Es el LCP de la pagina. `priority` emite el preload con
                fetchpriority="high" apuntando a la imagen real; en legacy ese
                preload apuntaba a michael-baccin-...webp, un archivo que no
                existe en el repo, y ademas no era la imagen que se mostraba.
                Las medidas son las intrinsecas del archivo (1920x1280): el
                tamano en pantalla lo fija .hero-img via CSS.
              */}
              <Image
                src="/img/248shots_so.webp"
                alt={t('image_alt')}
                className="hero-img"
                width={1920}
                height={1280}
                sizes="(max-width: 1024px) 90vw, 480px"
                priority
              />
              <div className="hero-card-overlay" aria-hidden="true" />
            </div>

            <div className="floating-chip chip-3" aria-hidden="true">
              <MaterialIcon name="star" /> {site.googleReviews.rating.toFixed(1)}{' '}
              <span lang="en">Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-wheel" />
      </div>
    </section>
  )
}
