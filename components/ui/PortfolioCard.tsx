import { useTranslations } from 'next-intl'
import type { Project } from '@/data/portfolio'
import { delayStyle } from '@/lib/css'

interface PortfolioCardProps {
  project: Project
  delay: number
}

export function PortfolioCard({ project, delay }: PortfolioCardProps) {
  const t = useTranslations('portfolio')
  const p = (suffix: string) => `projects.${project.id}.${suffix}`
  const isLive = project.status === 'live'

  return (
    <article className="portfolio-card reveal-up" style={delayStyle(delay)}>
      <div className="portfolio-img-wrap">
        <img
          src={project.image.src}
          alt={t(p('alt'))}
          className="portfolio-img"
          loading="lazy"
          width={project.image.width}
          height={project.image.height}
        />

        {!isLive && <div className="portfolio-soon-badge">{t(p('badge'))}</div>}

        <div className="portfolio-meta-chips" aria-hidden="true">
          <span className="portfolio-chip portfolio-chip-country">
            {project.flag} {t(`countries.${project.country}`)}
          </span>
          <span className="portfolio-chip portfolio-chip-category">{t(p('category'))}</span>
        </div>
      </div>

      <div className="portfolio-chips">
        <span className="chip chip-live">{t('chip_live')}</span>
        <span className="chip chip-country">{t(`countries.${project.country}`)}</span>
        <span className="chip chip-type">{t(`types.${project.type}`)}</span>
      </div>

      <div className="portfolio-body">
        <h3 className="portfolio-title">{project.name}</h3>
        <p className="portfolio-desc">{t(p('desc'))}</p>

        <ul className="portfolio-tags" aria-label="Tecnologias usadas">
          {project.tech.map((tech) => (
            <li key={tech} className="portfolio-tag">
              {tech}
            </li>
          ))}
        </ul>

        {project.url ? (
          <a
            className="btn btn-outline"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(p('cta_aria'))}
          >
            {t(p('cta'))}
          </a>
        ) : (
          <button className="btn btn-outline portfolio-btn-disabled" disabled aria-disabled="true">
            {t(p('cta'))}
          </button>
        )}
      </div>
    </article>
  )
}
