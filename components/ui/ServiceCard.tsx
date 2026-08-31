import { useTranslations } from 'next-intl'
import type { Service } from '@/data/services'
import { delayStyle } from '@/lib/css'
import { MaterialIcon } from '@/components/ui/icons'

interface ServiceCardProps {
  service: Service
  /** Escalonado del reveal, en segundos. */
  delay: number
}

export function ServiceCard({ service, delay }: ServiceCardProps) {
  const t = useTranslations(service.i18nKey)

  return (
    <div className="service-card reveal-up" style={delayStyle(delay)}>
      <div className="service-icon-wrap" aria-hidden="true">
        <MaterialIcon name={service.icon} />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('body')}</p>
      <div className="service-arrow" aria-hidden="true">
        <MaterialIcon name="arrow_forward" />
      </div>
    </div>
  )
}
