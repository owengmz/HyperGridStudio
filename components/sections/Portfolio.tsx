import { projects } from '@/data/portfolio'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PortfolioCard } from '@/components/ui/PortfolioCard'

/**
 * Teaser de portafolio: muestra los proyectos que hay en data/portfolio.
 * La pagina dedicada con el listado completo llega en etapas posteriores.
 */
export function Portfolio() {
  return (
    <section className="portfolio" id="portfolio" aria-label="Portafolio de proyectos">
      <div className="container">
        <SectionHeader
          tagKey="portfolio.tag"
          titleKey="portfolio.title"
          descKey="portfolio.desc"
        />

        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <PortfolioCard key={project.id} project={project} delay={(index + 1) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
