import { plans } from '@/data/pricing'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PricingCard } from '@/components/ui/PricingCard'

export function Pricing() {
  return (
    <section className="pricing" id="pricing" aria-label="Planes y precios">
      <div className="container">
        <SectionHeader tagKey="pricing.tag" titleKey="pricing.title" descKey="pricing.desc" />

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} delay={(index + 1) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
