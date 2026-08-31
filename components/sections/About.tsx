import { useTranslations } from 'next-intl'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceCard } from '@/components/ui/ServiceCard'

/**
 * Seccion "Nosotros", que ademas contiene las tarjetas de Servicios: en legacy
 * las dos secciones estan fusionadas bajo el mismo id.
 */
export function About() {
  const t = useTranslations('about')
  const { about } = site.stats

  const stats = [
    { value: about.yearsExperience, label: t('stat_years') },
    { value: about.projectsDelivered, label: t('stat_projects') },
    { value: about.satisfaction, label: t('stat_clients') },
    { value: about.support, label: t('stat_support') },
  ]

  return (
    <section className="about" id="about" aria-label="Sobre Hyper Grid Studio y servicios">
      <div className="container">
        <SectionHeader tagKey="about.tag" titleKey="about.title" descKey="about.desc" />

        <div className="about-stats reveal-up">
          {stats.map((stat) => (
            <div className="about-stat" key={stat.label}>
              <span className="about-stat-num">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} delay={(index + 1) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
