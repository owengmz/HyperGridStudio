import { useTranslations } from 'next-intl'
import type { PricingPlan } from '@/data/pricing'
import { cx, delayStyle } from '@/lib/css'
import { MaterialIcon } from '@/components/ui/icons'

interface PricingCardProps {
  plan: PricingPlan
  delay: number
}

export function PricingCard({ plan, delay }: PricingCardProps) {
  const t = useTranslations('pricing')
  const p = (suffix: string) => `plans.${plan.id}.${suffix}`

  /* Importe fijo desde data/, o el texto "a consultar" desde messages/. */
  const amount = plan.price.display ?? t(p('amount'))

  /* Las features son un array en el JSON: t.raw las devuelve sin formatear. */
  const features = t.raw(p('features')) as string[]

  return (
    <div
      className={cx('pricing-card', plan.featured && 'pricing-featured', 'reveal-up')}
      style={delayStyle(delay)}
    >
      {plan.featured && (
        <>
          <div className="pricing-badge">{t('badge_popular')}</div>
          <div className="pricing-glow" aria-hidden="true" />
        </>
      )}

      <div className="pricing-header">
        <span className="pricing-icon" aria-hidden="true">
          <MaterialIcon name={plan.icon} />
        </span>
        <h3>{t(p('name'))}</h3>
      </div>

      <div className="pricing-price">
        <span className="price-amount">{amount}</span>
        <span className="price-period">{t(p('period'))}</span>
      </div>

      <p className="pricing-desc">{t(p('desc'))}</p>

      <ul className="pricing-features">
        {features.map((feature) => (
          <li key={feature}>
            <MaterialIcon name="check_circle" /> <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a className="btn btn-outline w-full" href="#contact">
        {t(p('cta'))}
      </a>
    </div>
  )
}
